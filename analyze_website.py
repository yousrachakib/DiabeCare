import os
import json
from collections import defaultdict, Counter
import re

def analyze_website_folder(root_path='.', output_file='website_structure_analysis.json'):
    """
    Analyzes a website folder structure without exposing actual file contents.
    Generates statistics and metadata about HTML, CSS, JS files.
    
    Args:
        root_path (str): The path to the website folder
        output_file (str): The name of the output file to generate
    """
    # Statistics and data to collect
    stats = {
        'total_files': 0,
        'folder_structure': {},
        'file_types': Counter(),
        'file_sizes': {},
        'frameworks_detected': [],
        'html_pages': [],
        'js_files': [],
        'css_files': [],
        'asset_files': [],
        'dependencies': set(),
    }
    
    # Pattern to detect common frameworks
    framework_patterns = {
        'react': [r'react', r'jsx', r'reactdom'],
        'vue': [r'vue\.js', r'vue\.min\.js'],
        'angular': [r'angular', r'ng-'],
        'bootstrap': [r'bootstrap'],
        'jquery': [r'jquery'],
        'tailwind': [r'tailwind'],
        'wordpress': [r'wp-', r'wordpress'],
    }
    
    # Walk through the directory structure
    for root, dirs, files in os.walk(root_path):
        # Skip node_modules and other common folders to ignore
        if any(ignore in root for ignore in ['node_modules', '.git', '.vscode', '__pycache__']):
            continue
        
        relative_path = os.path.relpath(root, root_path)
        if relative_path == '.':
            relative_path = 'root'
            
        stats['folder_structure'][relative_path] = []
        
        for file in files:
            file_path = os.path.join(root, file)
            relative_file_path = os.path.join(relative_path, file)
            
            # Skip hidden files
            if file.startswith('.'):
                continue
                
            # Get file extension
            _, ext = os.path.splitext(file)
            ext = ext.lower().lstrip('.')
            
            if not ext:
                continue
                
            # Update total files
            stats['total_files'] += 1
            
            # Update file types counter
            stats['file_types'][ext] += 1
            
            # Get file size
            try:
                file_size = os.path.getsize(file_path)
                stats['file_sizes'][relative_file_path] = file_size
            except Exception:
                stats['file_sizes'][relative_file_path] = 0
            
            # Collect file info based on type
            if ext in ['html', 'htm']:
                stats['html_pages'].append({
                    'path': relative_file_path,
                    'size': stats['file_sizes'][relative_file_path],
                    'metadata': extract_html_metadata(file_path)
                })
                
            elif ext in ['js', 'jsx', 'ts', 'tsx']:
                stats['js_files'].append({
                    'path': relative_file_path,
                    'size': stats['file_sizes'][relative_file_path],
                    'imports': extract_js_imports(file_path)
                })
                
            elif ext in ['css', 'scss', 'sass', 'less']:
                stats['css_files'].append({
                    'path': relative_file_path,
                    'size': stats['file_sizes'][relative_file_path],
                    'imports': extract_css_imports(file_path)
                })
                
            elif ext in ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ttf', 'woff', 'woff2', 'eot']:
                stats['asset_files'].append({
                    'path': relative_file_path,
                    'size': stats['file_sizes'][relative_file_path],
                    'type': ext
                })
            
            # Add to folder structure
            stats['folder_structure'][relative_path].append({
                'name': file,
                'ext': ext,
                'size': stats['file_sizes'][relative_file_path]
            })
            
            # Detect frameworks
            if ext in ['js', 'html', 'css', 'json']:
                detect_frameworks(file_path, framework_patterns, stats)
    
    # Find package.json and extract dependencies if exists
    package_json_path = os.path.join(root_path, 'package.json')
    if os.path.exists(package_json_path):
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package_data = json.load(f)
                deps = {}
                if 'dependencies' in package_data:
                    deps.update(package_data['dependencies'])
                if 'devDependencies' in package_data:
                    deps.update(package_data['devDependencies'])
                stats['dependencies'] = deps
        except:
            pass
    
    # Convert sets to lists for JSON serialization
    stats['frameworks_detected'] = list(set(stats['frameworks_detected']))
    
    # Write output to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, default=str)
    
    print(f"Website structure analysis complete! Output saved to {output_file}")

def extract_html_metadata(file_path):
    """Extract basic metadata from HTML files without exposing content"""
    metadata = {
        'title': None,
        'meta_tags': 0,
        'scripts': 0,
        'stylesheets': 0,
        'forms': 0
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
            # Extract title
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
            if title_match:
                metadata['title'] = title_match.group(1).strip()
            
            # Count elements
            metadata['meta_tags'] = len(re.findall(r'<meta', content, re.IGNORECASE))
            metadata['scripts'] = len(re.findall(r'<script', content, re.IGNORECASE))
            metadata['stylesheets'] = len(re.findall(r'<link[^>]*rel=["\'](stylesheet|preload)["\']', content, re.IGNORECASE))
            metadata['forms'] = len(re.findall(r'<form', content, re.IGNORECASE))
    except:
        pass
        
    return metadata

def extract_js_imports(file_path):
    """Extract import statements from JS files without exposing code"""
    imports = []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
            # Look for ES6 imports
            import_matches = re.findall(r'import\s+(?:{[^}]*}|[^{;]*)\s+from\s+[\'"]([^\'"]+)[\'"]', content)
            imports.extend(import_matches)
            
            # Look for require statements
            require_matches = re.findall(r'require\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)', content)
            imports.extend(require_matches)
    except:
        pass
        
    return list(set(imports))

def extract_css_imports(file_path):
    """Extract import and url() statements from CSS files without exposing code"""
    imports = []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
            # Look for CSS imports
            import_matches = re.findall(r'@import\s+[\'"]([^\'"]+)[\'"]', content)
            imports.extend(import_matches)
            
            # Look for url() statements
            url_matches = re.findall(r'url\s*\(\s*[\'"]?([^\'")]+)[\'"]?\s*\)', content)
            imports.extend(url_matches)
    except:
        pass
        
    return list(set(imports))

def detect_frameworks(file_path, framework_patterns, stats):
    """Detect common frameworks used in the website"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().lower()
            
            for framework, patterns in framework_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        stats['frameworks_detected'].append(framework)
                        break
    except:
        pass

if __name__ == "__main__":
    analyze_website_folder()