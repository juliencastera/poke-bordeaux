import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { HeaderLogoComponent } from "./header-logo/header-logo.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, HeaderLogoComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  subtitle: string | null = null;
  isLoggedIn = false;

  constructor(private readonly router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleSubtitleChanges(event.urlAfterRedirects);
      }
    });
  }

  handleSubtitleChanges(url: string) {
    if (url === "/") {
      this.subtitle = "Gotta catch them all!";
    } else {
      this.subtitle = null;
    }
  }
}