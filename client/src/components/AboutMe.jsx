import React from "react";
import development from '../assets/developement.png';
import arrow from '../assets/curvedarrow.png';
import ownerPhoto from '../assets/myProfile.jpg';
import { motion } from 'framer-motion';
import { Linkedin, Github, Globe } from 'lucide-react';

export default function About() {
  // Variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.56, ease: [0.2, 0.8, 0.2, 1] } },
  };

  const headingWord = {
    hidden: { opacity: 0, y: -12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
  };

  const profileImg = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatLoop = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 3.2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        delay: 0.2,
      },
    },
  };

  const arrowEntrance = {
    hidden: { opacity: 0, x: -30, rotate: -12 },
    show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8, ease: "circOut" } },
  };

  const statItem = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section className="py-20 relative">
      {/* Decorative dots (animated float + subtle pulse) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 rounded-full w-32 md:w-48 h-32 md:h-48 bg-[#FFE5B4]"
        style={{
          backgroundImage: "radial-gradient(#B8860B 2px, transparent 2px)",
          backgroundSize: "10px 10px",
        }}
      />

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.18 }}
        viewport={{ once: true }}
        animate={{ scale: [1, 0.98, 1] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 -left-10 md:-left-20 rounded-full w-32 md:w-48 h-32 md:h-48 bg-[#FFE5B4]"
        style={{
          backgroundImage: "radial-gradient(#B8860B 2px, transparent 2px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="container mx-auto px-4 md:px-0 pt-5 md:pt-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col justify-center md:flex-row gap-8 md:gap-12 items-center mb-16 md:mb-32"
        >
          {/* Text Content */}
          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-5xl leading-tight font-bold px-4 md:px-0"
              style={{ fontFamily: 'Raleway, sans-serif' }}
            >
              {/* split into spans so the entrance feels layered */}
              <motion.span variants={headingWord} className="block text-black">
                Hey
              </motion.span>
              <motion.span variants={headingWord} className="block text-gray-500">
                there, I'm
              </motion.span>
              <motion.span variants={headingWord} className="block text-black">
                Suraj suryaveer.
              </motion.span>
              <motion.span variants={headingWord} className="block text-gray-600">
                A programmer /
              </motion.span>
              <motion.span variants={headingWord} className="inline text-gray-500">
                Web-
              </motion.span>{" "}
              <motion.span variants={headingWord} className="inline text-[#FFB800]">
                Developer
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-amber-900 font-semibold pt-4 md:pt-10 max-w-xl text-sm md:text-base px-4 md:px-0"
            >
              Building smart web solutions with React, AI, and modern tech. Freelancer, innovator, and problem solver.
            </motion.p>

            <motion.a
              href="https://surajportfolio-nine.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.button
                variants={fadeUp}
                className="bg-[#362C00] text-white px-6 mt-5 md:px-8 py-4 md:py-5 font-bold rounded-full hover:bg-[#60461c] transition-colors text-sm md:text-base"
                whileHover={{ y: -3, boxShadow: "0px 10px 30px rgba(54,44,0,0.18)" }}
              >
                Discover My Work
              </motion.button>
            </motion.a>
          </div>

          {/* Profile Image */}
          <motion.div
            variants={profileImg}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="w-[280px] md:w-[400px] px-4 md:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.03, rotate: -2 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="bg-[#FFFCE6] rounded-4xl md:rounded-[48px] aspect-square overflow-hidden shadow-lg"
              style={{ perspective: 800 }}
            >
              <motion.img
                src={ownerPhoto}
                alt="Suraj suryaveer"
                className="w-full h-full object-cover"
                whileTap={{ scale: 0.98 }}
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Timeline Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <motion.div className="md:mb-8 mb-2 flex flex-col items-center md:items-start gap-2 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="items-baseline flex gap-3 md:gap-5"
              style={{ fontFamily: 'Oxanium, sans-serif' }}
            >
              <span
                className="text-transparent font-bold text-4xl md:text-6xl"
                style={{ WebkitTextStroke: "1px #000" }}
              >
                IN
              </span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-bold text-6xl md:text-9xl"
              >
                2023
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-7xl text-transparent font-bold text-center md:text-left"
              style={{ WebkitTextStroke: "1px #000", fontFamily: 'Oxanium, sans-serif' }}
            >
              I STARTED
            </motion.div>
          </motion.div>

          {/* Arrow and Logo - Animated */}
          <div className="hidden md:flex relative justify-start items-center ml-72 gap-20 mb-16">
            <motion.img
              variants={arrowEntrance}
              initial="hidden"
              whileInView="show"
              src={arrow}
              alt="Arrow pointing to logo"
              className="w-36 rotate-60"
              viewport={{ once: true }}
            />
            <motion.img
              src={development}
              alt="development"
              className="w-64"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              viewport={{ once: true }}
              {...floatLoop}
            />
          </div>

          {/* Mobile arrow + logo */}
          <motion.img
            src={arrow}
            alt="Arrow pointing to logo"
            className="size-16 flex md:hidden ml-10 rotate-110 mb-6"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />

          <div className="flex md:hidden justify-center mb-8">
            <motion.img
              src={development}
              alt="development"
              className="w-48"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4 text-base md:text-xl px-4 md:px-0"
          >
            <motion.div variants={statItem} className="flex items-start flex-col justify-center gap-4">
              <motion.a
                variants={statItem}
                href="https://www.linkedin.com/in/surajkumar9630/"
                target="_blank"
                rel="noopener noreferrer"
                className='flex gap-5 flex-row items-center hover:text-red-500 transition-all'
                whileHover={{ y: -4 }}
              >
                <Linkedin size={24} />
                <h1>suraj kumar</h1>
              </motion.a>

              <motion.a
                variants={statItem}
                href="https://github.com/Suraj0950/"
                target="_blank"
                rel="noopener noreferrer"
                className='flex gap-5 flex-row items-center hover:text-red-500 transition-all'
                whileHover={{ y: -4 }}
              >
                <Github size={24} />
                <h1>Suraj0950</h1>
              </motion.a>

              <motion.a
                variants={statItem}
                href="https://surajportfolio-nine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className='flex gap-5 hover:text-red-500 transition-all flex-row items-center'
                whileHover={{ y: -4 }}
              >
                <Globe size={24} />
                <h1>SurajFolio</h1>
              </motion.a>
            </motion.div>
          </motion.div>

          <div className='text-center flex flex-col items-center gap-5 md:px-32 px-5 mt-28 justify-center'>
            <h1 className='md:text-sm text-xs font-semibold'>Short Description</h1>
            <p className='font-semibold md:text-base text-xs max-w-3xl'>
              Hey, I’m <span className='bg-yellow-200 px-1'>Suraj suryaveer</span>! I’m a tech enthusiast who loves building innovative solutions with code and creativity. Whether it’s designing websites, exploring AI, or working on unique side projects, I enjoy solving real-world problems with technology.
              Beyond coding, I’m always eager to learn new things, experiment with ideas, and take on exciting challenges. If I’m not working on a project, you’ll probably find me exploring new trends in tech or brainstorming my next big idea! 🚀 . I am currently pursuing my B.Tech in Government Engineering College, Palamu and working as a <span className='bg-yellow-200 px-1'>freelancer</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
