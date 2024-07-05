import { Component, OnInit } from '@angular/core';
import { Property } from '../../model/property';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit {
  public propertyId: number = 0;
  public mainPhotoUrl: string | null = null;
  property = new Property();

  constructor(
    private route: ActivatedRoute,
    private router: Router
    // private housingService: HousingService
  ) {}

  ngOnInit() {
    this.propertyId = +this.route.snapshot.params['id'];
    this.route.data.subscribe((data) => {
      this.property = (data as { prp: Property }).prp;
      console.log(this.property);
    });

    // this.property.age = this.housingService.getPropertyAge(
    //   this.property.estPossessionOn || ''
    // );
  }

  changePrimaryPhoto(mainPhotoUrl: string) {
    this.mainPhotoUrl = mainPhotoUrl;
  }
}
