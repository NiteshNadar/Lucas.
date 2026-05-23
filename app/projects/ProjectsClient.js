"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const easeExpo = [0.16, 1, 0.3, 1];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: easeExpo }
  }
};

const staggerViewContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function ProjectsClient({ allProjects }) {
  return (
    <main className="page-wrapper">
      <section className="section section-alt" style={{ minHeight: "100vh", paddingTop: "8rem" }}>
        <div className="container">
          <motion.div 
            className="projects-header" 
            style={{ marginBottom: "4rem" }}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={fadeUpVariant}>
              <Link href="/" className="magnetic-btn btn-primary" style={{ gap: "0.5rem", marginBottom: "2.5rem" }}>
                <i className="ph ph-arrow-left"></i> Back to Homepage
              </Link>
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="section-title">All Projects</motion.h1>
            <motion.p variants={fadeUpVariant} className="section-desc" style={{ maxWidth: "600px" }}>See the simple setups we built to save time and do the manual work for you.</motion.p>
          </motion.div>

          <motion.div 
            className="projects-archive-grid"
            variants={staggerViewContainer}
            initial="hidden"
            animate="visible"
          >
            {allProjects.map((project, idx) => (
              <motion.article 
                variants={fadeUpVariant} 
                key={idx} 
                className="archive-card"
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: { duration: 0.4, ease: easeExpo } }}
              >
                <div className="project-image">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority={idx < 3}
                  />
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
