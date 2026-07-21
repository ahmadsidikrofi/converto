'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroller({ children }) {
    // These values can be tweaked by the user
    // lerp: smooth transition speed (lower is smoother, standard is 0.1)
    // duration: scroll duration, can also be used instead of lerp
    // smoothWheel: enable smooth scrolling for mouse wheels
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
