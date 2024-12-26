import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Property } from '../../model/property';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {
  public propertyId: number = 0;
  public mainPhotoUrl: string | null = null;
  property = new Property();
  nextProperty = new Property();

  constructor(
    private route: ActivatedRoute,
    private router: RoutingService,
    private el: ElementRef<HTMLDivElement>
  ) {}

  ngAfterViewInit(): void {
    const iconContainer = this.el.nativeElement.querySelector('.three-d-icon');
    if (!iconContainer) return;
    const text = iconContainer.querySelector('.text-inner');
    const icon = iconContainer.querySelector('i');
    gsap.set(icon, { xPercent: 100 });
    iconContainer.addEventListener('mouseenter', () => {
      gsap.to(text, { x: 0 });
      gsap.to(icon, { xPercent: 0 });
    });
    iconContainer.addEventListener('mouseleave', () => {
      gsap.to(text, { x: -100 });
      gsap.to(icon, { xPercent: 100 });
    });
  }

  ngOnInit() {
    this.propertyId = +this.route.snapshot.params['id'];
    this.route.data.subscribe((data) => {
      const propertiesObject = data as {
        prp: { currentItem: Property; nextItem: Property | null };
      };
      this.property = propertiesObject.prp.currentItem;
      this.nextProperty = propertiesObject.prp.currentItem;
    });

    // this.property.age = this.housingService.getPropertyAge(
    //   this.property.estPossessionOn || ''
    // );
  }

  navigateTo3D() {
    this.router.navigate([`/property-view-3d/${this.propertyId}`]);
  }

  changePrimaryPhoto(mainPhotoUrl: string) {
    this.mainPhotoUrl = mainPhotoUrl;
  }
}
