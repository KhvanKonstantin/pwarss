// Created by Konstantin Khvan on 7/4/20, 9:54 AM


import * as React from "react";
import {motion} from "framer-motion";
import {makeStyles} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

const slideVariant = {
    initial: {
        x: "100vw"
    },
    animate: {
        x: "0",
        transition: {
            duration: .2
        }
    },
    exit: {
        x: "100vw",
        transition: {
            duration: .2
        }
    }
}

const noopVariant = {
    initial: {
        x: "0"
    },
    animate: {
        x: "0"
    },
    exit: {
        x: "0",
        transition: {
            duration: .3
        }
    }
}

const useStyles = makeStyles(theme => ({
    page: {
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: grey[50]
    },
    slide: {
        zIndex: 1
    }
}));

interface AnimatedPageProps {
    slide: boolean
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({children, slide}) => {
    const classes = useStyles();

    return <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slide ? slideVariant : noopVariant}
        className={classes.page + " " + (slide ? classes.slide : "") + " MuiContainer-root MuiContainer-disableGutters"}>
        {children}
    </motion.div>
}
