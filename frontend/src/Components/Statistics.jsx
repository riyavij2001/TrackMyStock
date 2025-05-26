import React, { useEffect, useState, useRef } from 'react';

function Statistics() {
    const stats = [
        { number: 1200, heading: 'Happy Clients' },
        { number: 50, heading: 'Stocks Tracked' },
        { number: 10, heading: 'Years of Experience' },
        { number: 24, heading: 'Support Available' },
    ];

    const AnimatedNumber = ({ value, isVisible }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            let start = 0;
            const duration = 1000; // Animation duration in milliseconds
            const increment = value / (duration / 50); // Increment per frame (50ms per frame)

            const interval = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(interval);
                } else {
                    setCount(Math.ceil(start));
                }
            }, 50);

            return () => clearInterval(interval);
        }, [value, isVisible]); // Re-run animation when `isVisible` changes

        return <span>{count.toLocaleString()}</span>;
    };

    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true); // Trigger animation once
                    observer.disconnect(); // Stop observing after triggering once
                }
            },
            { threshold: 0.2 } // Trigger when 20% of the component is visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <span>
            <div
                ref={ref}
                className="bg-[#1E1E1E] text-gray-100 py-6 w-[70%] flex justify-center rounded-3xl mx-auto mt-14"
            >
                <div className="container mx-auto flex flex-wrap justify-around">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center py-2"
                        >
                            <h3 className="text-3xl font-extrabold text-[#B9E204]">
                                <AnimatedNumber value={stat.number} isVisible={isVisible} />
                                {stat.heading === 'Support Available' ? '' : '+'}
                            </h3>
                            <p className="mt-2 text-gray-300">{stat.heading}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-400 mt-4">
                Please note: The data displayed here is for demonstration purposes only.
            </p>
        </span>
    );
}

export default Statistics;