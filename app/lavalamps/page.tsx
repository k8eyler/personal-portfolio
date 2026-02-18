"use client";

import Image from 'next/image';

export default function LavaLampsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Lava Lamps — AI Video Loop</h1>
          <p className="text-muted-foreground">
            Generating an AI video based on the lava lamps in my living room that can effectively loop
          </p>
        </div>

        {/* Final Product */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Final Product</h2>
          <video
            src="/lavacopy.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg"
          />
        </div>

        {/* Reference Photo */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Reference Photo</h2>
          <p className="text-muted-foreground mb-4">
            The original photo of the lava lamps I was trying to replicate in video form.
          </p>
          <div className="relative w-full max-w-2xl mx-auto aspect-video">
            <Image
              src="/lavareference.jpg"
              alt="Lava lamp reference photo"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>

        {/* First Stylized Still */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">First Stylized Still</h2>
          <p className="text-muted-foreground mb-4">
            The first rendering of a stylized still image from the AI.
          </p>
          <div className="relative w-full max-w-2xl mx-auto aspect-video">
            <Image
              src="/lavageminiimage.png"
              alt="First stylized still rendering"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Challenge - Lava */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Challenge — Lava</h2>
          <p className="text-muted-foreground mb-4">
            One of the key challenges of the project was getting the different tools to keep the lava IN the lamp.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <video src="/lavaout1.mp4" controls muted playsInline className="w-full rounded-lg" />
            <video src="/lavaout2.mp4" controls muted playsInline className="w-full rounded-lg" />
            <video src="/lavaout3.mp4" controls muted playsInline className="w-full rounded-lg" />
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">The Solution</h2>
          <p className="text-muted-foreground mb-4">
            The ultimate solution was not to use a reference photo — instead, it was to deliver a very detailed prompt:
          </p>
          <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded-r-lg text-sm text-muted-foreground italic leading-relaxed">
            A cozy modern interior scene rendered as a 3D illustration in cute glossy plastic style, Memoji aesthetic. On the left, a large fiddle leaf fig plant with oversized smooth rounded leaves, simplified shapes, soft curves, and subtle plastic shine. The leaves are thick, slightly exaggerated, and vibrant green with soft gradients.
            On the right, a light wood cabinet with rounded edges and smooth matte finish. On top of the cabinet are five lava lamps in different pastel colors (pink, cyan, purple, glitter, turquoise), each simplified with chunky proportions, glossy plastic material, soft internal glow, and slowly drifting rounded lava shapes inside. The bases are smooth metallic-looking but stylized like polished toy plastic.
            Soft warm ambient lighting, gentle pastel color palette, clean white wall background, subtle soft shadows, global illumination, high detail, depth of field, playful and minimal composition, toy-like materials, smooth bevels on all edges, Apple product render style.
          </blockquote>
        </div>

        {/* Runner Up */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Runner Up</h2>
          <video src="/lavarunnerup.mp4" controls muted playsInline className="w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
}
