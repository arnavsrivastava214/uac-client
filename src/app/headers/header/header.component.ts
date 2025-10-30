import { Component, AfterViewInit } from "@angular/core";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // 🔥 Define tour steps for NOTES, Gallery, Contact
    const steps: DriveStep[] = [
      {
        element: "#notes-link",
        popover: {
          title: "Notes Section",
          description: "Access all your class notes here.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#gallery-link",
        popover: {
          title: "Gallery Section",
          description: "Browse student activities and classroom photos.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#contact-link",
        popover: {
          title: "Contact Section",
          description: "Get in touch with us or request support.",
          side: "bottom",
          align: "center",
        },
      },
    ];

    // 🚀 Initialize the driver
    const driverObj = driver({
      steps,
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      allowClose: true,
      popoverClass: "uac-theme", // 👈 matches your custom theme in SCSS
    });

    // ⏳ Start after slight delay for DOM to render
    setTimeout(() => driverObj.drive(), 600);
  }
}
