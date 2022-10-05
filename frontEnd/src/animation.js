export const pageAnimation = {
    hidden: {
        opacity: 0,
        y: 400,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.5,
            when: 'beforeChildren',
            staggerChildren: 0.25,
        },
    },
    exit: {
        opacity: 0,
        y: 200,
        transition: {
            duration: 0.25,
        },
    },
};

export const fade = {
    hidden: {
        opacity: 0,
    },
    show: {
        opacity: 1,
        transition: {
            duration: 0.75,
            ease: 'easeOut',
        },
    },
};

export const titleAnim = {
    hidden: {
        y: 1200,
    },
    show: {
        y: 0,
        transition: {
            duration: 0.25,
            ease: 'easeOut',
        },
    },
};

export const imageProfile = {
    hidden: {
        scale: 0,
    },
    show: {
        rotate: 360,
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        },
    },
};

export const LineAnim = {
    hidden: {
        width: '0%',
    },
    show: {
        width: '100%',
        transition: { duration: 1 },
    },
};

export const slider = {
    hidden: {
        x: '-130%',
        skew: '45deg',
    },
    show: {
        x: '100%',
        skew: '0deg',
        transition: { ease: 'easeOut', duration: 0.7 },
    },
};

export const sliderContainer = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, ease: 'easeOut' } },
};
