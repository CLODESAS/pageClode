import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { CartService } from './shared/data/cart.service';
import { HeaderComponent } from './shared/header/header.component';
import { WhatsappButtonComponent } from './shared/whatsapp/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, WhatsappButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly cart = inject(CartService);
  protected readonly showMini = signal(false);
}
