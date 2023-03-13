import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  navLinks: { name: string, link: string }[] = [
    { name: 'Search', link: '/' },
    { name: 'FAQ', link: '/faq' },
    { name: 'Contact', link: '/contact' }
  ]

  constructor() { }

  linkActive (link: string) {
    return window.location.pathname === link
  }

  ngOnInit(): void {
  }

}
