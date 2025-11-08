import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { filename, content } = await request.json();
    
    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Filename and content are required' },
        { status: 400 }
      );
    }

    // Create a temporary directory for compilation
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, filename);
    
    // Write the LaTeX content to the temporary file
    fs.writeFileSync(tempFilePath, content);

    // Execute the engine.js command
    const enginePath = path.join(process.cwd(), '..', 'Engine', 'engine.js');
    const command = `node ${enginePath} convert ${tempFilePath}`;
    
    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: tempDir,
      timeout: 30000, // 30 second timeout
    });

    // Clean up temporary files
    try {
      fs.unlinkSync(tempFilePath);
      // Also clean up any generated files if needed
      const htmlFilePath = tempFilePath.replace('.tex', '.html');
      if (fs.existsSync(htmlFilePath)) {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        fs.unlinkSync(htmlFilePath);
        
        return NextResponse.json({
          success: true,
          html: htmlContent,
          output: stdout,
        });
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }

    return NextResponse.json({
      success: false,
      error: 'No HTML output generated',
      output: stdout,
      stderr: stderr,
    });

  } catch (error: any) {
    console.error('Compilation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to compile LaTeX',
        stderr: error.stderr || error.stdout,
      },
      { status: 500 }
    );
  }
}