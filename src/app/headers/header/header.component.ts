import { Component, AfterViewInit } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [RouterLink, RouterLinkActive, RouterModule]
})
export class HeaderComponent {

}
