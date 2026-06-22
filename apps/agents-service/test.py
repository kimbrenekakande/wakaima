import markdown

md_text = "# Hello World\nThis is **bold** text."
html = markdown.markdown(md_text)

print(html)
# Output: <h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>
