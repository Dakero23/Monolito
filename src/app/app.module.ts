import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,    
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,  
    MatCardModule,
    MatSnackBarModule, 
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.substring(7)],
        disallowedRoutes: [`http://${environment.HOST.substring(7)}/login/enviarCorreo`],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
