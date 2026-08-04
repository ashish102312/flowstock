import React from 'react';
import { motion } from 'framer-motion';
import { Package, Building2, BarChart3, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      icon: <Package className="w-6 h-6 text-[#01472e]" />,
      title: "Product Management",
      desc: "Manage products, categories, pricing, and stock with ease."
    },
    {
      icon: <Building2 className="w-6 h-6 text-[#01472e]" />,
      title: "Warehouse Management",
      desc: "Monitor multiple warehouses and storage locations efficiently."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#01472e]" />,
      title: "Inventory Tracking",
      desc: "Track inventory levels and receive low-stock insights."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#01472e]" />,
      title: "Secure Access",
      desc: "JWT authentication with role-based dashboards for Admin, Manager, and Customer."
    }
  ];

  return (
    <section id="about" className="py-24 px-6 sm:px-12 lg:px-20 font-sans" style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-forest)', zIndex: 10, position: 'relative' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block py-1.5 px-4 rounded-full text-xs font-bold tracking-widest uppercase" style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-forest)' }}>
                About FlowStock
              </span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="anton text-5xl sm:text-6xl leading-[1.1] mb-6" style={{ color: 'var(--color-forest)' }}>
              SMART WAREHOUSE & INVENTORY MANAGEMENT
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg leading-relaxed mb-10" style={{ opacity: 0.8, color: 'var(--color-forest)' }}>
              FlowStock is a modern warehouse and inventory management platform that helps businesses efficiently manage products, warehouses, inventory, customer orders, and daily operations from one centralized dashboard. With secure authentication, role-based access, and an intuitive user interface, FlowStock simplifies inventory management and improves operational efficiency.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-transform hover:scale-105" style={{ backgroundColor: 'var(--color-forest)', color: 'var(--color-cream)' }}>
                Learn More
              </button>
              <button
                onClick={() => {
                  toast((t) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>Contact Us:</p>
                      <a href="tel:+917814607949" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}> +91 7814607949</a>
                      <a href="https://www.instagram.com/flowstock.mg?utm_source=qr" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '500' }}> Instagram</a>
                    </div>
                  ), { duration: 6000 });
                }}
                className="px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-transform hover:scale-105"
                style={{ backgroundColor: 'transparent', color: 'var(--color-forest)', border: '2px solid var(--color-forest)' }}
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side: Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl opacity-40" style={{ background: 'linear-gradient(to top right, var(--color-olive), var(--color-sage))' }}></div>
            <img
              src="/about_dashboard_green.png"
              alt="Warehouse Dashboard Mockup"
              className="w-full h-auto rounded-3xl shadow-2xl"
              style={{ border: '4px solid var(--color-olive)' }}
            />
            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 p-4 rounded-2xl shadow-xl flex items-center gap-4"
              style={{ backgroundColor: 'var(--color-cream)', border: '2px solid var(--color-sage)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-sage)', color: 'var(--color-forest)' }}>
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest" style={{ opacity: 0.6, color: 'var(--color-forest)' }}>Efficiency</p>
                <p className="anton text-2xl" style={{ color: 'var(--color-forest)' }}>+42%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              style={{ backgroundColor: '#f5f2d0', border: '1px solid var(--color-sage)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-sage)' }}>
                {feature.icon}
              </div>
              <h3 className="anton text-2xl mb-3" style={{ color: 'var(--color-forest)', letterSpacing: '0.02em' }}>{feature.title}</h3>
              <p className="leading-relaxed" style={{ opacity: 0.7, color: 'var(--color-forest)' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
