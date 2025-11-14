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

    // Create a temporary directory for compilation in /tmp (writable in serverless)
    const tempDir = path.join('/tmp', `latex-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const tempFilePath = path.join(tempDir, filename);
    
    // Write the LaTeX content to the temporary file
    fs.writeFileSync(tempFilePath, content);

    // Execute the engine-wrapper.js command
    const enginePath = path.join(process.cwd(), 'src', 'app', 'api', 'compile', 'engine-wrapper.js');
    const command = `cd ${tempDir} && node ${enginePath} convert ${filename}`;
    
    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
    });

    // Clean up temporary files
    try {
      const htmlFilePath = path.join(tempDir, filename.replace('.tex', '.html'));
      if (fs.existsSync(htmlFilePath)) {
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        
        // Clean up entire temp directory
        fs.rmSync(tempDir, { recursive: true, force: true });
        
        return NextResponse.json({
          success: true,
          html: htmlContent,
          output: stdout,
        });
      } else {
        // Clean up even if no HTML generated
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
      // Force cleanup
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
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