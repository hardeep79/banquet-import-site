"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
}

export function Hero({ imageSrc, imageAlt }: HeroProps) {
  const reduced = useReducedMotion();
  return (
    <section className="relative h-[88vh] min-h-[640px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={reduced ? { scale: 1 } : { scale: 1.05 }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-canvas)]/60 via-transparent to-[var(--color-bg-canvas)]" />
      </motion.div>

      <Container className="relative h-full flex flex-col justify-end pb-24">
        <Eyebrow>{brand.serviceArea}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-[var(--font-display)] text-5xl md:text-7xl leading-[1.05] tracking-[var(--tracking-display)]">
          {brand.tagline}
        </h1>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/quote">{brand.ctaPrimary}</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/catalog">{brand.ctaSecondary}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
