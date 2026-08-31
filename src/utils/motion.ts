import { animate, inView, type AnimationOptions } from "motion";

/**
 * Anima la entrada suave (Fade In) de elementos coincidentes al cargarse la vista
 */
export function animateFadeIn(
  target: string | Element | NodeListOf<Element>,
  options?: AnimationOptions,
) {
  return animate(
    target,
    { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] },
    { duration: 0.5, easing: "ease-out", ...options },
  );
}

/**
 * Anima elementos en cuanto entran en el viewport (Scroll Reveal con inView)
 */
export function animateOnScroll(
  containerOrSelector: string,
  targetSelector = ":scope > *",
  options?: AnimationOptions,
) {
  const containers = document.querySelectorAll(containerOrSelector);
  containers.forEach((container) => {
    inView(container, () => {
      const items = container.querySelectorAll(targetSelector);
      if (items.length > 0) {
        items.forEach((item, index) => {
          animate(
            item,
            {
              opacity: [0, 1],
              transform: ["translateY(20px)", "translateY(0px)"],
            },
            {
              duration: 0.5,
              delay: index * 0.08,
              easing: "ease-out",
              ...options,
            },
          );
        });
      } else {
        animate(
          container,
          {
            opacity: [0, 1],
            transform: ["translateY(20px)", "translateY(0px)"],
          },
          { duration: 0.5, easing: "ease-out", ...options },
        );
      }
    });
  });
}

/**
 * Efecto de flotación suave continua acelerado por GPU
 */
export function animateFloating(
  target: string | Element | NodeListOf<Element>,
  distance = 10,
  duration = 4,
) {
  return animate(
    target,
    {
      transform: [
        "translateY(0px)",
        `translateY(-${distance}px)`,
        "translateY(0px)",
      ],
    },
    { duration, repeat: Infinity, easing: "ease-in-out" },
  );
}
