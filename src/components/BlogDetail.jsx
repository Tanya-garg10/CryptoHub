import { useParams, useNavigate } from "react-router-dom";
import "./Blog.css";
import { blogPosts } from "../data/blogDetailsData";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogPosts[id];

  const buildArticleText = () => {
    let out = `${blog.title}\n${blog.date}\n\n`;
    if (blog.toc && blog.toc.length) {
      out += "Table of Contents:\n";
      blog.toc.forEach((t, i) => (out += `${i + 1}. ${t}\n`));
      out += "\n";
    }
    blog.sections.forEach((s) => {
      out += `${s.heading}\n${s.text}\n\n`;
    });
    return out;
  };

  const downloadText = (filename = "article.txt") => {
    const text = buildArticleText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async (filename = "article.pdf") => {
    try {
      const mod = await import("jspdf");
      const jsPDFLib = mod.jsPDF || mod.default || mod;
      const doc = new jsPDFLib({ unit: "pt", format: "letter" });
      const left = 40;
      const topStart = 60;
      const lineHeight = 14;
      let y = topStart;

      doc.setFontSize(18);
      doc.text(blog.title, left, y);
      y += 24;
      doc.setFontSize(10);
      doc.text(blog.date, left, y);
      y += 20;

      doc.setFontSize(12);
      if (blog.toc && blog.toc.length) {
        doc.text("Table of Contents:", left, y);
        y += 16;
        blog.toc.forEach((t, i) => {
          const txt = `${i + 1}. ${t}`;
          const split = doc.splitTextToSize(txt, 500);
          doc.text(split, left, y);
          y += lineHeight * split.length;
        });
        y += 8;
      }

      blog.sections.forEach((s) => {
        doc.setFontSize(14);
        const hsplit = doc.splitTextToSize(s.heading, 500);
        doc.text(hsplit, left, y);
        y += lineHeight * hsplit.length;

        doc.setFontSize(11);
        const tsplit = doc.splitTextToSize(s.text, 500);

        tsplit.forEach((line) => {
          if (y > doc.internal.pageSize.height - 60) {
            doc.addPage();
            y = 60;
          }
          doc.text(line, left, y);
          y += lineHeight;
        });

        y += 12;
      });

      doc.save(filename);
    } catch (err) {
      console.warn("jsPDF failed, falling back to text download.", err);
      downloadText("article.txt");
    }
  };

  if (!blog) {
    return <h2 style={{ textAlign: "center" }}>Blog not found</h2>;
  }

  return (
    <div className="blog-page">

      {/* Title + Download Button Row */}
      <div className="blog-title-row">
        <div>
          <h1 data-aos="fade-in" className="blog-title">{blog.title}</h1>
          <p data-aos="fade-in" className="blog-card-date">{blog.date}</p>
        </div>

        <button
          className="blog-download-btn blog-download-top"
          onClick={() =>
            downloadPDF(`${blog.title.replace(/[^a-z0-9]/gi, "_").slice(0,150)}.pdf`)
          }
          aria-label="Download article as PDF"
          title="Download as PDF"
        >
          Download Article
        </button>
      </div>

      {/* Center Image */}
      <div data-aos="zoom-in" className="blog-hero">
        <img src={blog.image} alt={blog.title} />
      </div>

      {/* Table of Contents */}
      <div data-aos="fade-in" className="blog-desc">
        <h3>Table of Contents</h3>
        <ul>
          {blog.toc.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Blog Content */}
      {blog.sections.map((section, index) => (
        <div data-aos="fade-up" key={index} className="blog-desc">
          <h2>{section.heading}</h2>
          <p style={{ whiteSpace: "pre-line" }}>{section.text}</p>
        </div>
      ))}

      {/* Go Back Button */}
      <div data-aos="fade-out" className="blog-back-container">
        <button
          className="blog-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          <span className="back-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="back-text">Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
