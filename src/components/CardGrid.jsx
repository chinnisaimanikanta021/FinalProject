import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// A specialized 3D Tilt Card wrapper
const TiltCard = ({ item, onSelect, itemKey }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-tilt-wrapper"
        >
            <div
                className="glass-panel"
                onClick={() => onSelect(item)}
                style={{
                    padding: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    height: '100%',
                    transform: "translateZ(30px)", // Popping effect
                }}
            >
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                {item.type && (
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-teal)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {item.type} in {item.eduTitle}
                    </span>
                )}
                {item.description && (
                    <p style={{
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'var(--text-muted)'
                    }}>
                        {item.description}
                    </p>
                )}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '16px',
                    color: 'var(--accent-blue)',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    Explore <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>&rarr;</motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const CardGrid = ({ title, items, onSelect, itemKey = "id" }) => {
    return (
        <div className="container" style={{ perspective: '1200px' }}>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {title}
            </motion.h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                padding: '20px 0'
            }}>
                {items.map((item) => (
                    <TiltCard key={item[itemKey]} item={item} onSelect={onSelect} itemKey={itemKey} />
                ))}
            </div>
        </div>
    );
};

export default CardGrid;
