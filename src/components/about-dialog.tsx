import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PropsWithChildren } from "react";
import { ScrollArea } from "./ui/scroll-area";

export function AboutDialog(props: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="w-md sm:h-auto overflow-hidden rounded-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-semibold text-primary">
              About TERMALAB
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80dvh]">
            {/* Scrollable Content */}
            <div className="p-4 text-sm leading-relaxed space-y-4">
              <p>Hello, learners!</p>

              <p>
                I am <strong className="text-primary">Phoebe Key I. Cutaran</strong>, a DepEd teacher and
                a Master of Arts in Education (MAEd) major in Physical Science
                candidate at West Visayas State University – Main Campus. I also
                completed my undergraduate degree, Bachelor of Secondary
                Education major in Physics, at the same university (Batch 2018).
              </p>

              <p>
                I graduated from Regional Science High School for Region VI for
                my secondary education and from Lezo Integrated School for my
                elementary education. I am from Bagto, Lezo, Aklan.
              </p>

              <p>
                I was born on November 15, 1997, and I am the daughter of Pablo
                M. Cutaran Jr. and Domelyn I. Cutaran.
              </p>

              <p>
                This mobile game application was developed as part of my thesis
                entitled:
              </p>

              <blockquote className="border-l-4 pl-3 italic">
                “Development and Evaluation of TERMALAB: A Game-Based Material
                for Spelling and Conceptual Understanding of Learners in
                Physical Science.”
              </blockquote>

              <p>
                I believe that being weak in spelling does not mean that a
                learner is not intelligent. Even I make mistakes sometimes.
                However, if you develop both your spelling skills and your
                understanding of the concepts behind scientific terms, learning
                becomes much easier.
              </p>

              <p>
                This game was designed to help and support learners who are
                struggling, while also serving as a brain exercise. TERMALAB is
                a simple yet meaningful way to spend your time—because
                sometimes, the things that seem “boring” are actually the ones
                that help us grow. Kailangan lang ng tiyaga at practice.
              </p>

              <p className="p-4 text-muted-foreground bg-muted rounded-md">
                This game is inspired by Wordle, which I personally enjoy
                playing. The terms included were based on the results of two
                tests administered to Grade 10 students and were evaluated by
                six experts. The definitions and sample sentences were adapted
                from MELCs, lesson exemplars, DepEd modules, and Quipper
                resources.
              </p>
            </div>
          </ScrollArea>

          {/* Footer (optional) */}
          <div className="p-3 border-t text-center text-xs text-muted-foreground">
            TERMALAB © {new Date().getFullYear()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
