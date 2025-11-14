'use client';

import { useState, useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import FileExplorer from '../FileExplorer';
import CodeEditor from '../CodeEditor';
import PreviewPanel from '../PreviewPanel';
import PremiumHeader from '../PremiumHeader';
import SimpleSidebar from '../SimpleSidebar';
import VSCodeSidebar from '../VSCodeSidebar';

const EditorLayout = () => {
  const [activeFile, setActiveFile] = useState<string | null>('portfolio.tex');
  const [isRunning, setIsRunning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({
    'portfolio.tex': `\\documentclass{portfolio}
\\usepackage[utf8]{inputenc}

\\title{Ibn al-Haytham (Alhazen)}
\\author{Father of Modern Optics and Scientific Methodology}
\\date{965 AD - 1040 AD}

\\begin{document}

% Navigation configuration
\\navlogo{ibn.png}
\\nabbar{Biography, Contributions, Legacy, Works}

% Include profile image
\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{ibn.png}
\\caption{Ibn al-Haytham (Alhazen) - Father of Modern Optics}
\\end{figure}


\\section{Biography}

\\textbf{Ibn al-Haytham} (Latinized as \\textit{Alhazen}), born in \\textbf{965 AD} in Basra, Iraq, was a pioneering mathematician, astronomer, and physicist who made fundamental contributions to the principles of optics, astronomy, mathematics, and the scientific method.

\\subsection{Early Life and Education}

Abū ʿAlī al-Ḥasan ibn al-Ḥasan ibn al-Haytham was born during the Islamic Golden Age. He received his education in Basra, where he developed exceptional mathematical abilities and a keen interest in natural sciences. His reputation as a brilliant scholar led to his invitation to Cairo by the Fatimid Caliph al-Hakim.

\\subsection{Life in Cairo}

In Cairo, Ibn al-Haytham conducted his most important optical research. According to historical accounts, he feigned madness to avoid the Caliph's dangerous political schemes, allowing him to dedicate himself entirely to scientific pursuits while under house arrest.

\\section{Major Contributions}

\\subsection{Book of Optics (Kitāb al-Manāẓir)}

His magnum opus, \\textit{Kitāb al-Manāẓir} (Book of Optics), written between 1011 and 1021, revolutionized the understanding of vision and light:

\\begin{itemize}
    \\item Established that vision occurs when light travels from objects to the eye
    \\item Proved the intromission theory of vision against the extramission theory
    \\item Systematically studied reflection, refraction, and color phenomena
    \\item Investigated the psychology of visual perception
\\end{itemize}

\\subsection{Scientific Method}

Ibn al-Haytham pioneered the modern scientific method:
\\begin{itemize}
    \\item Emphasized systematic experimentation and controlled testing
    \\item Stressed the importance of mathematical description of natural phenomena
    \\item Combined theoretical reasoning with empirical verification
    \\item Advocated for reproducible experiments and peer review
\\end{itemize}

\\subsection{Mathematics and Astronomy}

\\begin{itemize}
    \\item Developed early analytic geometry concepts
    \\item Solved problems using what we now call algebraic methods
    \\item Made significant contributions to number theory
    \\item Studied celestial mechanics and planetary motion
    \\item Attempted to measure the height of Earth's atmosphere
\\end{itemize}

\\section{Legacy and Influence}

\\subsection{Impact on Western Science}

Ibn al-Haytham's works were translated into Latin in the 12th and 13th centuries and profoundly influenced:
\\begin{itemize}
    \\item Roger Bacon and other medieval European scholars
    \\item The development of perspective in Renaissance art
    \\item Kepler's laws of planetary motion
    \\item Newton's work on optics and the scientific method
\\end{itemize}

\\subsection{Modern Recognition}

Today, Ibn al-Haytham is recognized as:
\\begin{itemize}
    \\item The "Father of Modern Optics"
    \\item A pioneer of the scientific method
    \\item One of the greatest scientists of the medieval period
    \\item An important bridge between ancient and modern science
\\end{itemize}

\\subsection{The "Alhazen Problem"}

His famous mathematical problem about finding the point of reflection on a curved mirror from a given object to a given observer is known as "Alhazen's Problem" and continued to challenge mathematicians for centuries.

\\section{Principal Works}

\\begin{itemize}
    \\item \\textit{Kitāb al-Manāẓir} (Book of Optics) - 7 volumes
    \\item \\textit{Treatise on Light} - Foundational work on optics
    \\item \\textit{On the Shape of the Eclipse} - Astronomical calculations
    \\item \\textit{Analysis and Synthesis} - Mathematical methodology
    \\item \\textit{Treatise on Place} - Contributions to physics
    \\item Over 200 surviving works on various scientific topics
\\end{itemize}

\\section{Personal Philosophy}

Ibn al-Haytham believed that:
\\begin{quote}
    "The truth is the only thing that can unite men, while falsehood is the only thing that can divide them."
\\end{quote}

He emphasized the importance of skepticism, questioning authority, and seeking truth through rigorous investigation - principles that remain central to modern science.

\\section{Historical Context}

Ibn al-Haytham lived during the peak of the Islamic Golden Age, a period of extraordinary cultural, scientific, and intellectual advancement that spanned from the 8th to the 14th centuries. His work exemplifies the sophisticated scientific tradition that flourished in the Islamic world and laid crucial groundwork for the European Renaissance.

\\end{document}`,
    'tutorial.tex': `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{setspace}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{babel}
\\geometry{margin=1in}

\\title{\\textbf{LaTeX to HTML Engine Tutorial}}
\\author{Complete Feature Showcase}
\\date{\\today}

\\begin{document}

\\maketitle

\\onehalfspacing

\\tableofcontents

\\newpage

\\section*{Introduction}

This tutorial demonstrates the complete capabilities of the LaTeX to HTML conversion engine. All features including math equations, images, multilingual text, themes, and formatting are supported.

\\section*{Text Formatting Examples}

\\subsection*{Basic Text Formatting}
This document shows \\textbf{bold text}, \\textit{italic text}, \\texttt{code text}, \\underline{underlined text}, and \\emph{emphasized text}.

\\subsection*{Font Sizes}
\\tiny Tiny text} \\scriptsize Script size} \\footnotesize Footnote size} \\small Small text} 
\\normalsize Normal text} \\large Large text} \\Large Large text} \\LARGE Large text} \\huge Huge text} \\Huge Huge text}

\\subsection*{Multilingual Text Support}
\\subsubsection*{Arabic Text}
\\textbf{العربية}: مرحبا بك في محرر LaTeX الاحترافي. هذا يدعم الكتابة من اليمين إلى اليسار والنصوص العربية.

\\subsubsection*{Bangla Text}
\\textbf{বাংলা}: LaTeX থেকে HTML রূপান্তরকারীতে আপনাকে স্বাগতম। এটি বাংলা টেক্সট সমর্থন করে।

\\subsubsection*{English Text}
\\textbf{English}: Welcome to the professional LaTeX to HTML converter. This supports multiple languages and complex formatting.

\\subsubsection*{Spanish Text}
\\textbf{Español}: ¡Bienvenido al convertidor profesional de LaTeX a HTML! Esto soporta múltiples idiomas y formato complejo.

\\subsubsection*{Chinese Text}
\\textbf{中文}: 欢迎使用专业的LaTeX转HTML转换器！这支持多种语言和复杂格式。

\\subsubsection*{Hindi Text}
\\textbf{हिन्दी}: LaTeX से HTML कनवर्टर में आपका स्वागत है। यह कई भाषाओं और जटिल फॉर्मेटिंग का समर्थन करता है।

\\section*{Mathematical Equations}

\\subsection*{Inline Math}
Here are some inline math examples: $E = mc^2$, $\\sin\\theta = \\frac{opp}{hyp}$, and $\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n}x_i$.

\\subsection*{Display Math}
\\subsubsection*{Quadratic Formula}
\\[
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\]

\\subsubsection*{Integration}
\\[
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
\\]

\\subsubsection*{Matrix Operations}
Let $A \\in \\mathbb{R}^{2\\times2}$ be:
\\[
A = \\begin{pmatrix}
2 & 1\\\\
5 & 3
\\end{pmatrix}
\\]

The inverse is:
\\[
A^{-1} = \\dfrac{1}{\\det(A)}\\begin{pmatrix}
d & -b\\\\
-c & a
\\end{pmatrix} = \\begin{pmatrix}
3 & -1\\\\
-5 & 2
\\end{pmatrix}
\\]

\\subsubsection*{Complex Equations}
\\[
\\begin{cases}
\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u\\\\
u(x,0) = f(x)\\\\
u(0,t) = u(L,t) = 0
\\end{cases}
\\]

\\subsubsection*{Summation and Products}
\\[
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}, \\quad \\prod_{i=1}^{n} i = n!
\\]

\\section*{Lists and Enumerations}

\\subsection*{Bullet Points (itemize)}
\\begin{itemize}
    \\item \\textbf{First item} with bold text
    \\item \\textit{Second item} with italic text  
    \\item Third item with math: $\\alpha + \\beta = \\gamma$
    \\item Nested list:
    \\begin{itemize}
        \\item Sub-item one
        \\item Sub-item two with $\\sqrt{2}$
    \\end{itemize}
    \\item Final item
\\end{itemize}

\\subsection*{Numbered Lists (enumerate)}
\\begin{enumerate}
    \\item First step: Define the problem
    \\item Second step: Formulate equations
    \\item Third step: Solve using:
    \\begin{enumerate}
        \\item Analytical methods
        \\item Numerical approximation
        \\item Verification
    \\end{enumerate}
    \\item Fourth step: Validate results
\\end{enumerate}

\\section*{Tables and Data}

\\subsection*{Simple Table}
\\begin{tabular}{|l|c|r|}
\\hline
\\textbf{Function} & \\textbf{Domain} & \\textbf{Range} \\\\
\\hline
$f(x) = x^2$ & $\\mathbb{R}$ & $[0, \\infty)$ \\\\
$g(x) = \\sin(x)$ & $\\mathbb{R}$ & $[-1, 1]$ \\\\
$h(x) = e^x$ & $\\mathbb{R}$ & $(0, \\infty)$ \\\\
\\hline
\\end{tabular}

\\subsection*{Data Table with Results}
\\begin{tabular}{@{}lll@{}}
\\toprule
\\textbf{Parameter} & \\textbf{Value} & \\textbf{Units} \\\\
\\midrule
Speed of light & $c = 2.998 \\times 10^8$ & m/s \\\\
Planck constant & $h = 6.626 \\times 10^{-34}$ & J·s \\\\
Gravitational constant & $G = 6.674 \\times 10^{-11}$ & N·m²/kg² \\\\
\\bottomrule
\\end{tabular}

\\section*{Quotes and Citations}

\\subsection*{Block Quotes}
\\begin{quote}
Mathematics is the language in which God has written the universe. The great book of nature can be read only by those who know the language in which it was written. And that language is mathematics.
\\end{quote}

\\subsection*{Attributed Quote}
\\begin{quotation}
The important thing in science is not so much to obtain new facts as to discover new ways of thinking about them.
\\end{quotation}

\\section*{Special Mathematical Notation}

\\subsection*{Vectors and Bold Math}
Let $\\bm{v} = (v_1, v_2, v_3)$ be a vector in $\\mathbb{R}^3$. The magnitude is $|\\bm{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$.

\\subsection*{Blackboard Bold}
Common number sets: $\\mathbb{N}$ (natural numbers), $\\mathbb{Z}$ (integers), $\\mathbb{Q}$ (rationals), $\\mathbb{R}$ (real numbers), $\\mathbb{C}$ (complex numbers).

\\subsection*{Special Functions}
\\begin{itemize}
    \\item Trigonometric: $\\sin(30°) = 0.5$, $\\cos(45°) = \\frac{\\sqrt{2}}{2}$
    \\item Logarithmic: $\\ln(e) = 1$, $\\log_{10}(100) = 2$
    \\item Exponential: $e^{i\\pi} + 1 = 0$ (Euler's identity)
\\end{itemize}

\\section*{Programming Code Examples}

\\subsection*{Multiple Language Support}
The LaTeX to HTML engine now supports syntax highlighting for multiple programming languages. Users can use custom environments or the standard \\texttt{\\textbackslash begin\{code\}} environment.

\\subsection*{C++ Programming}
\\begin{cpp}
#include <iostream>
#include <vector>
#include <algorithm>

class Calculator {
private:
    std::vector<double> numbers;
    
public:
    Calculator() = default;
    
    void addNumber(double num) {
        numbers.push_back(num);
    }
    
    double calculateSum() const {
        return std::accumulate(numbers.begin(), numbers.end(), 0.0);
    }
    
    double calculateAverage() const {
        return numbers.empty() ? 0.0 : calculateSum() / numbers.size();
    }
};

int main() {
    Calculator calc;
    calc.addNumber(10.5);
    calc.addNumber(20.3);
    calc.addNumber(15.7);
    
    std::cout << "Sum: " << calc.calculateSum() << std::endl;
    std::cout << "Average: " << calc.calculateAverage() << std::endl;
    
    return 0;
}
\\end{cpp}

\\subsection*{Python Programming}
\\begin{python}
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Dict, Optional

class DataAnalyzer:
    def __init__(self, data: List[float]):
        self.data = data
    
    def calculate_statistics(self) -> Dict[str, float]:
        """Calculate basic statistical measures"""
        if not self.data:
            return {}
        
        return {
            'mean': np.mean(self.data),
            'median': np.median(self.data),
            'std': np.std(self.data),
            'min': np.min(self.data),
            'max': np.max(self.data)
        }
    
    def plot_histogram(self, bins: int = 20, save_path: Optional[str] = None):
        """Create and optionally save histogram"""
        plt.figure(figsize=(10, 6))
        plt.hist(self.data, bins=bins, alpha=0.7, color='skyblue', edgecolor='black')
        plt.title('Data Distribution')
        plt.xlabel('Value')
        plt.ylabel('Frequency')
        plt.grid(True, alpha=0.3)
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.show()

# Example usage
data = [12.5, 15.2, 18.7, 14.3, 16.8, 19.1, 13.6, 17.4, 15.9, 18.2]
analyzer = DataAnalyzer(data)
stats = analyzer.calculate_statistics()

for key, value in stats.items():
    print(f"{key.capitalize()}: {value:.2f}")
\\end{python}

\\subsection*{Java Programming}
\\begin{java}
import java.util.*;
import java.util.stream.Collectors;

public class StudentManagement {
    private Map<String, Student> students;
    
    public StudentManagement() {
        this.students = new HashMap<>();
    }
    
    public void addStudent(Student student) {
        students.put(student.getId(), student);
    }
    
    public Optional<Student> getStudent(String id) {
        return Optional.ofNullable(students.get(id));
    }
    
    public List<Student> getStudentsByGPA(double minGPA) {
        return students.values().stream()
                .filter(student -> student.getGpa() >= minGPA)
                .sorted(Comparator.comparing(Student::getGpa).reversed())
                .collect(Collectors.toList());
    }
    
    public double calculateAverageGPA() {
        return students.values().stream()
                .mapToDouble(Student::getGpa)
                .average()
                .orElse(0.0);
    }
    
    public static void main(String[] args) {
        StudentManagement system = new StudentManagement();
        
        // Add sample students
        system.addStudent(new Student("S001", "Alice Johnson", 3.8));
        system.addStudent(new Student("S002", "Bob Smith", 3.5));
        system.addStudent(new Student("S003", "Charlie Brown", 3.9));
        
        // Find top performers
        List<Student> topStudents = system.getStudentsByGPA(3.7);
        System.out.println("Top Students (GPA >= 3.7):");
        topStudents.forEach(student -> 
            System.out.printf("%s - GPA: %.2f%n", student.getName(), student.getGpa()));
        
        System.out.printf("Average GPA: %.2f%n", system.calculateAverageGPA());
    }
}

class Student {
    private String id;
    private String name;
    private double gpa;
    
    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }
    
    // Getters and setters
    public String getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    public void setGpa(double gpa) { this.gpa = gpa; }
}
\\end{java}

\\subsection*{JavaScript Programming}
\\begin{javascript}
class FileProcessor {
    constructor() {
        this.processedFiles = new Map();
        this.observers = [];
    }
    
    // Observer pattern for file processing events
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    notify(event, data) {
        this.observers.forEach(observer => observer(event, data));
    }
    
    async processFile(filePath, options = {}) {
        try {
            const content = await this.readFile(filePath);
            const processedContent = await this.processContent(content, options);
            
            const fileInfo = {
                path: filePath,
                size: content.length,
                processedAt: new Date().toISOString(),
                options: options
            };
            
            this.processedFiles.set(filePath, {
                original: content,
                processed: processedContent,
                metadata: fileInfo
            });
            
            this.notify('fileProcessed', fileInfo);
            return processedContent;
            
        } catch (error) {
            this.notify('error', { path: filePath, error: error.message });
            throw error;
        }
    }
    
    async processContent(content, options) {
        let processed = content;
        
        // Apply transformations based on options
        if (options.minify) {
            processed = this.minifyContent(processed);
        }
        
        if (options.addLineNumbers) {
            processed = this.addLineNumbers(processed);
        }
        
        if (options.highlightSyntax) {
            processed = await this.highlightSyntax(processed);
        }
        
        return processed;
    }
    
    minifyContent(content) {
        return content
            .replace(/\s+/g, ' ')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '')
            .trim();
    }
    
    addLineNumbers(content) {
        return content
            .split('\n')
            .map((line, index) => ((index + 1).toString().padStart(3)) + ': ' + line)
            .join('\n');
    }
    
    async highlightSyntax(content) {
        // Simulate syntax highlighting (in real implementation, use a library like Prism.js)
        return '<pre><code class="language-javascript">' + content + '</code></pre>';
    }
    
    async readFile(filePath) {
        // Simulated file reading - in real implementation, use fs.readFile
        return '// Sample content from ' + filePath + '\nfunction sample() {\n    return "Hello from ' + filePath + '";\n}';
    }
    
    getProcessedFiles() {
        return Array.from(this.processedFiles.entries()).map(([path, data]) => ({
            path,
            ...data
        }));
    }
}

// Example usage with event handling
const processor = new FileProcessor();

processor.subscribe((event, data) => {
    switch(event) {
        case 'fileProcessed':
            console.log('File processed: ' + data.path + ' (' + data.size + ' bytes)');
            break;
        case 'error':
            console.error('Error processing ' + data.path + ': ' + data.error);
            break;
    }
});

// Process multiple files
const files = ['script.js', 'styles.css', 'index.html'];
files.forEach(file => {
    processor.processFile(file, { 
        addLineNumbers: true, 
        highlightSyntax: true 
    });
});
\\end{javascript}

\\subsection*{SQL Database Queries}
\\begin{sql}
-- Advanced SQL queries demonstrating complex joins and aggregations

-- Create sample tables
CREATE TABLE departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    manager_id INT,
    budget DECIMAL(10,2)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT,
    salary DECIMAL(10,2),
    hire_date DATE,
    manager_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- Insert sample data
INSERT INTO departments (department_id, department_name, budget) VALUES
(1, 'Engineering', 101, 500000.00),
(2, 'Marketing', 102, 300000.00),
(3, 'Sales', 103, 400000.00),
(4, 'Human Resources', 104, 250000.00);

INSERT INTO employees (employee_id, first_name, last_name, email, department_id, salary, hire_date) VALUES
(1, 'John', 'Doe', 'john.doe@company.com', 1, 85000.00, '2022-01-15'),
(2, 'Jane', 'Smith', 'jane.smith@company.com', 1, 92000.00, '2021-03-10'),
(3, 'Bob', 'Johnson', 'bob.johnson@company.com', 2, 65000.00, '2022-06-01'),
(4, 'Alice', 'Williams', 'alice.williams@company.com', 3, 78000.00, '2021-11-20');

-- Complex query with multiple joins and aggregations
SELECT 
    d.department_name,
    COUNT(e.employee_id) AS employee_count,
    AVG(e.salary) AS average_salary,
    MAX(e.salary) AS max_salary,
    MIN(e.salary) AS min_salary,
    d.budget,
    (SELECT COUNT(*) FROM employees e2 WHERE e2.department_id = d.department_id) * AVG(e.salary) AS projected_payroll
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.budget
HAVING COUNT(e.employee_id) > 0
ORDER BY average_salary DESC;

-- Window functions for ranking
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.salary,
    d.department_name,
    RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS dept_rank,
    RANK() OVER (ORDER BY e.salary DESC) AS company_rank,
    e.salary - AVG(e.salary) OVER (PARTITION BY e.department_id) AS salary_difference
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
\\end{sql}

\\subsection*{JSON Configuration}
\\begin{json}
{
  "application": {
    "name": "LaTeX to HTML Converter",
    "version": "2.0.0",
    "description": "Professional document conversion tool",
    "author": "Professor Lab",
    "license": "MIT",
    "settings": {
      "defaultTheme": "light",
      "mathRenderer": "mathjax",
      "codeHighlighting": {
        "enabled": true,
        "theme": "github",
        "languages": [
          "javascript",
          "python",
          "java",
          "cpp",
          "html",
          "css"
        ]
      },
      "output": {
        "format": "html",
        "minify": false,
        "validate": true,
        "embedFonts": true
      }
    },
    "features": {
      "math": ["equations", "symbols", "matrices"],
      "text": ["formatting", "internationalization", "fonts"],
      "structure": ["sections", "subsections", "tables", "lists"],
      "media": ["images", "figures", "captions"],
      "code": ["syntax-highlighting", "multi-language"]
    },
    "supportedFormats": {
      "input": ["tex", "latex"],
      "output": ["html", "pdf"],
      "images": ["png", "jpg", "jpeg", "gif", "svg"]
    },
    "dependencies": {
      "latex": ">=2.0.0",
      "mathjax": "^3.0.0",
      "prismjs": "^1.0.0"
    }
  }
}
\\end{json}

\\subsection*{HTML Markup}
\\begin{html}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaTeX to HTML Converter</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 LaTeX to HTML Converter</h1>
            <p>Professional document conversion with advanced features</p>
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>🧮 Mathematical Equations</h3>
                <p>Support for complex math expressions, matrices, and symbols</p>
            </div>
            
            <div class="feature-card">
                <h3>🌍 Multilingual Support</h3>
                <p>Renders text in multiple languages including RTL support</p>
            </div>
            
            <div class="feature-card">
                <h3>💻 Code Highlighting</h3>
                <p>Syntax highlighting for C++, Python, Java, and more</p>
            </div>
        </div>
    </div>
</body>
</html>
\\end{html}

\\subsection*{Using the Code Environments}

Users can write code in multiple ways:

\\textbf{Method 1: Custom Language Environments}
\\begin{verbatim}
\\begin\{cpp\}
// C++ code here
\\end\{cpp\}

\\begin\{python\}
# Python code here  
\\end\{python\}

\\begin\{java\}
// Java code here
\\end\{java\}
\\end{verbatim}

\\textbf{Method 2: Generic Code Environment}
\\begin{verbatim}
\\begin\{code\}[cpp]
// C++ code with language specified
\\end\{code\}

\\begin\{code\}
// Generic code block
\\end\{code\}
\\end{verbatim}

\\textbf{Method 3: Traditional Verbatim}
\\begin{verbatim}
\\begin\{verbatim\}
// Plain text code block
\\end\{verbatim\}
\\end{verbatim}

All code blocks will be properly formatted and displayed with syntax highlighting appropriate to the programming language!

\\section*{Advanced Mathematical Examples}

\\subsection*{Calculus}
\\subsubsection*{Derivatives}
\\[
\\frac{d}{dx}\\sin(x) = \\cos(x), \\quad \\frac{d}{dx}e^x = e^x, \\quad \\frac{d}{dx}\\ln(x) = \\frac{1}{x}
\\]

\\subsubsection*{Limits}
\\[
\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1, \\quad \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e
\\]

\\subsection*{Linear Algebra}
\\subsubsection*{Eigenvalue Problem}
For matrix $A$, eigenvalues $\\lambda$ satisfy:
\\[
\\det(A - \\lambda I) = 0
\\]

For $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 2 \\end{pmatrix}$:
\\[
\\det\\begin{pmatrix} 3-\\lambda & 1 \\\\ 2 & 2-\\lambda \\end{pmatrix} = (3-\\lambda)(2-\\lambda) - 2 = \\lambda^2 - 5\\lambda + 4 = 0
\\]

Thus $\\lambda = 1$ or $\\lambda = 4$.

\\section*{Cross-References and Structure}

\\subsection*{Document Structure}
This document demonstrates:
\\begin{enumerate}
    \\item Multilingual text support (Arabic, Bangla, English, Spanish, Chinese, Hindi)
    \\item Complete math equation rendering
    \\item Tables and data presentation
    \\item Lists and hierarchical structure
    \\item Quotes and special formatting
    \\item Code examples and verbatim text
\\end{enumerate}

\\subsection*{Theme Support}
This LaTeX document will be converted to HTML with:
\\begin{itemize}
    \\item \\textbf{White theme}: Clean, professional appearance
    \\item \\textbf{Dark theme}: Easy on the eyes for extended reading
    \\item Responsive design for mobile devices
    \\item Mathematical equation rendering
    \\item Image support and linking
\\end{itemize}

\\section*{Conclusion}

This tutorial demonstrates that the LaTeX to HTML conversion engine supports:
\\begin{itemize}
    \\item ✅ Complete mathematical notation
    \\item ✅ Multilingual text rendering
    \\item ✅ Complex document structure
    \\item ✅ Tables, lists, and formatting
    \\item ✅ Theme customization
    \\item ✅ Responsive output
\\end{itemize}

All features work seamlessly together to create professional HTML documents from LaTeX source.

\\end{document}`,
    'ibn.png': '', // This is a reference to the image file
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  const handleFileSelect = (filename: string) => {
    // Don't set image or PDF files as active in the editor
    const extension = filename.split('.').pop()?.toLowerCase();
    const isImageOrPDF = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf'].includes(extension || '');
    
    if (!isImageOrPDF) {
      setActiveFile(filename);
    }
  };

  const handleFileContentChange = (filename: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content,
    }));
  };

  const getCurrentFileContent = () => {
    if (!activeFile) return '';
    
    // Handle image files
    const extension = activeFile.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      return `[Image File: ${activeFile}]`;
    }
    
    return files[activeFile] || '';
  };

  const handleFileCreate = (filename: string) => {
    // Handle image files - don't create them as text files
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      // Don't create image files through the text editor
      alert('Image files cannot be created through the text editor. Please upload image files instead.');
      return;
    }
    
    setFiles(prev => ({
      ...prev,
      [filename]: getDefaultContentForFile(filename),
    }));
    setActiveFile(filename);
  };

  const handleFileDelete = (filename: string) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[filename];
      return newFiles;
    });
    if (activeFile === filename) {
      setActiveFile(null);
    }
  };

  const handleFileRename = (oldName: string, newName: string) => {
    if (files[newName]) {
      alert('A file with this name already exists!');
      return;
    }
    setFiles(prev => {
      const newFiles = { ...prev };
      newFiles[newName] = newFiles[oldName];
      delete newFiles[oldName];
      return newFiles;
    });
    if (activeFile === oldName) {
      setActiveFile(newName);
    }
  };

  const handleFolderCreate = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      console.log(`Creating folder: ${folderName.trim()}`);
      // In a real implementation, you would handle folder creation
    }
  };

  const handleFileDownload = (filename: string, content: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    // Handle image files
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      // For image files, download from public directory
      const element = document.createElement('a');
      element.setAttribute('href', `/${filename}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return;
    }
    
    // Handle text files
    const fileContent = files[filename] || content;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = async (uploadedFiles: File[]) => {
    for (const file of uploadedFiles) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Handle image files
      if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
        // For images, create a URL reference
        const imageUrl = URL.createObjectURL(file);
        setFiles(prev => ({
          ...prev,
          [file.name]: `[Image: ${file.name}]\\n\\includegraphics[width=0.8\\textwidth]{${file.name}}`,
        }));
      } else {
        // Handle text files
        try {
          const content = await file.text();
          setFiles(prev => ({
            ...prev,
            [file.name]: content,
          }));
        } catch (error) {
          console.error('Error reading file:', file.name, error);
          alert(`Error reading file: ${file.name}`);
        }
      }
    }
  };

  const getDefaultContentForFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tex':
        return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{${filename.replace('.tex', '')}}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Your LaTeX content here...

\\end{document}`;
      case 'bib':
        return `@article{key2023,
    author = {Author Name},
    title = {Article Title},
    journal = {Journal Name},
    year = {2023}
}`;
      case 'cls':
        return `% ${filename}
% LaTeX class file
\\NeedsTeXFormat{LaTeX2e}
\\ProvidesClass{${filename.replace('.cls', '')}}

\\LoadClass{article}

% Custom class definitions here`;
      case 'sty':
        return `% ${filename}
% LaTeX style file
\\ProvidesPackage{${filename.replace('.sty', '')}}

% Custom style definitions here`;
      case 'md':
        return `# ${filename}

## Getting Started

This is a markdown file.`;
      default:
        return `% ${filename}
% New file created`;
    }
  };

  const handleCompile = async () => {
    if (!activeFile || !activeFile.endsWith('.tex')) {
      alert('Please select a .tex file to compile');
      return;
    }

    setIsRunning(true);
    
    try {
      // Process content to handle image paths for client-side
      let processedContent = files[activeFile];
      
      // Replace image paths with absolute URLs for client-side compilation
      processedContent = processedContent.replace(
        /\\includegraphics\[([^}]+)\]{([^}]+)}/g,
        (match, options, filename) => {
          const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
          const extension = filename.split('.').pop()?.toLowerCase();
          
          if (imageExtensions.includes(extension || '')) {
            // Convert to absolute URL for client-side access
            return `\\includegraphics[${options}]{${window.location.origin}/${filename}}`;
          }
          return match;
        }
      );

      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: activeFile,
          content: processedContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the files object with the compiled HTML
        setFiles(prev => ({
          ...prev,
          [activeFile.replace('.tex', '.html')]: result.html,
        }));
        
        // Switch to the HTML file for preview
        setActiveFile(activeFile.replace('.tex', '.html'));
      } else {
        alert(`Compilation failed: ${result.error}`);
        console.error('Compilation error:', result);
      }
    } catch (error) {
      console.error('Failed to compile:', error);
      alert('Failed to compile. Please check the console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ pt: '72px' }}>
      <PremiumHeader 
        onCompile={handleCompile} 
        isCompiling={isRunning} 
        onMenuToggle={() => {
          if (isMobile) {
            setMobileSidebarOpen(!mobileSidebarOpen);
          } else {
            setDrawerOpen(!drawerOpen);
          }
        }}
        onSidebarToggle={() => setDrawerOpen(!drawerOpen)}
        sidebarOpen={drawerOpen}
      />
      <Box className="editor-content" sx={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        {!isMobile && (
          <VSCodeSidebar
            files={Object.keys(files)}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
            onFileDownload={handleFileDownload}
            onFileUpload={handleFileUpload}
          />
        )}
        
        {isMobile && mobileSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1100,
              }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            
            {/* Mobile sidebar */}
            <Box
              sx={{
                position: 'fixed',
                top: '72px',
                left: 0,
                bottom: 0,
                width: '280px',
                zIndex: 1200,
                backgroundColor: '#252526',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <VSCodeSidebar
                files={Object.keys(files)}
                activeFile={activeFile}
                onFileSelect={(filename) => {
                  handleFileSelect(filename);
                  setMobileSidebarOpen(false); // Close sidebar after selecting file
                }}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
                onFileDownload={handleFileDownload}
                onFileUpload={handleFileUpload}
              />
            </Box>
          </>
        )}
        
        <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <CodeEditor
                filename={activeFile}
                content={getCurrentFileContent()}
                onChange={(content) => {
                  if (activeFile) {
                    handleFileContentChange(activeFile, content);
                  }
                }}
              />
            </Panel>
            
            <PanelResizeHandle className="panel-resize-handle" />
            
            <Panel defaultSize={50} minSize={30}>
              <PreviewPanel files={files} activeFile={activeFile} />
            </Panel>
          </PanelGroup>
        </Box>
      </Box>
    </Box>
  );
};

// Helper function to detect mobile devices
const isMobileDevice = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

export default EditorLayout;