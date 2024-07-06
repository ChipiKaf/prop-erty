import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  active: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.active);
  }

  toggleMenu() {
    this.active = !this.active;
    console.log(this.active);
  }
}
