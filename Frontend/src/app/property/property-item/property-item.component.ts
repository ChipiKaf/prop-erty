import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPropertyBase } from '../../model/ipropertybase';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-property-item',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule],
  templateUrl: './property-item.component.html',
  // styleUrl: './property-item.component.scss',
  styleUrls: [
    './property-item.component.scss',
    '../property-list/property-list.component.scss',
  ],
})
export class PropertyItemComponent implements OnInit, OnChanges {
  @Input() property!: IPropertyBase;
  imageLoading = false;
  loadedImageUrl = '';

  // No need to reload images if already loaded
  private static imageCache: Set<string> = new Set();

  ngOnInit(): void {
    this.preloadImage(this.property.image);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && this.property?.image) {
      this.preloadImage(this.property.image);
    }
  }

  // To prevent flashing image
  private preloadImage(url: string | undefined): void {
    if (!url) {
      console.log('In here');
      this.imageLoading = false;
      return;
    }

    if (PropertyItemComponent.imageCache.has(url)) {
      this.loadedImageUrl = url;
      this.imageLoading = false;
      return;
    }
    this.imageLoading = true;

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setTimeout(() => {
        this.loadedImageUrl = url;
        this.imageLoading = false;
        PropertyItemComponent.imageCache.add(url);
      }, 200);
    };

    img.onerror = () => {
      this.imageLoading = false;
    };
  }
}
