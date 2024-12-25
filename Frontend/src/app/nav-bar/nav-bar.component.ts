import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export enum ListItemTypes {
  AUTHENTICATED,
  UNAUTHENTICATED,
}

export type ListItem = {
  name: string;
  url: string;
  type: ListItemTypes;
  actions?: () => void;
};

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  active: boolean = false;
  listItems: ListItem[] = [
    {
      name: 'Properties',
      url: '/',
      type: ListItemTypes.UNAUTHENTICATED,
    },
    {
      name: 'Contact',
      url: '/',
      type: ListItemTypes.UNAUTHENTICATED,
    },
    {
      name: 'Logout',
      url: '/login',
      type: ListItemTypes.AUTHENTICATED,
      actions: () => {
        localStorage.removeItem('token');
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.active);
  }

  toggleMenu() {
    this.active = !this.active;
    console.log(this.active);
  }

  isItemVisible(item: ListItem): boolean {
    return (
      item.type === ListItemTypes.UNAUTHENTICATED ||
      (item.type === ListItemTypes.AUTHENTICATED &&
        !!localStorage.getItem('token'))
    );
  }

  navigate(item: ListItem) {
    if (item.actions) item.actions();
    this.router.navigate([item.url]);
  }
}
