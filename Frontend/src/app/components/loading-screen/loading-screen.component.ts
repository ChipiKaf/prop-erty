import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  // OnInit,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { getCoord, snapToClosest } from '../../utils/number';
import { getUniqueValues } from '../../utils/array';

type Rect = { el: SVGElement; x: number; y: number };

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss',
})
export class LoadingScreenComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement> | null = null;
  @ViewChild('textContainer', { static: true })
  textContainer: ElementRef<HTMLDivElement> | null = null;
  @ViewChild('text', { static: true })
  text: ElementRef<HTMLElement> | null = null;
  @ViewChild('svg', { static: true }) svg: ElementRef<SVGElement> | null = null;
  @ViewChild('tl', { static: true }) tl: ElementRef<SVGRectElement> | null =
    null;
  @ViewChild('bl', { static: true }) bl: ElementRef<SVGRectElement> | null =
    null;
  @ViewChild('br', { static: true }) br: ElementRef<SVGRectElement> | null =
    null;
  @ViewChild('tr', { static: true }) tr: ElementRef<SVGRectElement> | null =
    null;
  rects: Rect[] = [];
  mainTl = gsap.timeline({
    defaults: {
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.cycleT1.play();
      },
    },
  });
  cycleT1 = gsap.timeline({
    defaults: {
      duration: 0.5,
      repeat: -1,
      delay: 0.5,
      ease: 'power3.inOut',
      repeatRefresh: true,
      repeatDelay: 0.5,
    },
  });

  private possibleXs: number[] = [];
  private possibleYs: number[] = [];

  private getNumberAttribute(element: SVGElement, attri: 'x' | 'y') {
    const val = parseFloat(element.getAttribute(attri) || '0');
    if (attri === 'x') {
      return snapToClosest(val, this.possibleXs);
    } else {
      return snapToClosest(val, this.possibleYs);
    }
  }

  private configureMainAnimation() {
    if (!this.container || !this.svg || !this.text) return;
    this.mainTl
      .fromTo(
        this.container.nativeElement,
        // "from" state: off screen
        { y: '-110%' },
        // "to" state: on screen
        { y: '0%', duration: 1 }
      )
      .to(this.svg.nativeElement, {
        y: 0,
        duration: 0.5,
      })
      .to(
        this.text.nativeElement,
        {
          y: 0,
          duration: 0.5,
        },
        '<+0.2'
      );

    this.mainTl.pause().progress(1);
  }

  private configureCycleAnimation() {
    if (!this.tl || !this.bl || !this.br || !this.tr) return;

    this.rects = [
      {
        el: this.tl.nativeElement,
        x: getCoord(this.tl.nativeElement, 'x'),
        y: getCoord(this.tl.nativeElement, 'y'),
      },
      {
        el: this.bl.nativeElement,
        x: getCoord(this.bl.nativeElement, 'x'),
        y: getCoord(this.bl.nativeElement, 'y'),
      },
      {
        el: this.br.nativeElement,
        x: getCoord(this.br.nativeElement, 'x'),
        y: getCoord(this.br.nativeElement, 'y'),
      },
      {
        el: this.tr.nativeElement,
        x: getCoord(this.tr.nativeElement, 'x'),
        y: getCoord(this.tr.nativeElement, 'y'),
      },
    ];

    // Store values for snapping
    this.rects.forEach((val) => {
      this.possibleXs.push(val.x);
      this.possibleYs.push(val.y);
      this.possibleXs = getUniqueValues(this.possibleXs);
      this.possibleYs = getUniqueValues(this.possibleYs);
    });

    this.cycleT1
      .to(this.rects[0].el, {
        attr: {
          x: () => this.getNumberAttribute(this.rects[1].el, 'x'),
          y: () => this.getNumberAttribute(this.rects[1].el, 'y'),
        },
      })
      .to(
        this.rects[1].el,
        {
          attr: {
            x: () => this.getNumberAttribute(this.rects[2].el, 'x'),
            y: () => this.getNumberAttribute(this.rects[2].el, 'y'),
          },
        },
        '<-0.5'
      )
      .to(
        this.rects[2].el,
        {
          attr: {
            x: () => this.getNumberAttribute(this.rects[3].el, 'x'),
            y: () => this.getNumberAttribute(this.rects[3].el, 'y'),
          },
        },
        '<-0.5'
      )
      .to(
        this.rects[3].el,
        {
          attr: {
            x: () => this.getNumberAttribute(this.rects[0].el, 'x'),
            y: () => this.getNumberAttribute(this.rects[0].el, 'y'),
          },
        },
        '<-0.5'
      );
  }
  ngOnInit(): void {
    this.cycleT1.pause();
  }
  ngAfterViewInit(): void {
    this.configureMainAnimation();
    this.configureCycleAnimation();
  }
}
