import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations()
  ],
})
.then(() => {
  const loader = document.getElementById('loader-wrapper');

  if (loader) {
    const loadTime = Date.now() - (window as any).loaderStartTime;
    const minDisplayTime = 2000;
    const remainingTime = Math.max(0, minDisplayTime - loadTime);

    setTimeout(() => {
      loader.classList.add('fade-out');

      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 500);

    }, remainingTime);
  }
})
.catch(console.error);