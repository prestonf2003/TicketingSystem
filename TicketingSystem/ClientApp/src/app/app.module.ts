import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TodoDisplayComponent } from './todo-display/todo-display.component';
import { TicketViewComponent} from './ticket-view/ticket-view.component';
import { SubmitTicketComponent } from './submit-ticket/submit-ticket.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TodoDisplayComponent,
    TicketViewComponent,
    SubmitTicketComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: TodoDisplayComponent, pathMatch: 'full' },
      { path: 'todo-display', component: TodoDisplayComponent },
      { path: 'submit-ticket', component: SubmitTicketComponent },
      { path: 'ticket-view', component: TicketViewComponent },
      { path: 'stats', component: StatsComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

