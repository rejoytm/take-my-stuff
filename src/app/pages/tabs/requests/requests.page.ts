import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { Message } from '@interfaces/message';
import { getStorageImageSrc } from '@utils/storage';
import { formatTimestamp } from '@utils/date';
import { Database, push, ref, set } from '@angular/fire/database';
import { AuthService } from '@services/auth.service';
import { AppUser } from '@interfaces/app-user';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgFor, NgClass, FormsModule],
})
export class RequestsPage implements OnInit {
  users: { [id: string]: AppUser } = {};
  messages: Message[] = [];

  newMessageContent: string = '';

  constructor(
    private authService: AuthService,
    public dataService: DataService,
    private database: Database,
  ) {}

  ngOnInit() {
    this.dataService.messages$.subscribe((messages) => {
      this.messages = Object.values(messages);
    });

    this.dataService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  sendMessage() {
    // Check if the new message's content is not empty
    if (!this.newMessageContent.length) return;

    const sender = this.authService.userSubject.value;
    if (!sender) return;

    const messagesRef = ref(this.database, 'messages');
    const newMessageRef = push(messagesRef);

    const message: Message = {
      id: newMessageRef.key!,
      content: this.newMessageContent,
      senderId: sender.id,
      sentAt: Date.now(),
    };

    set(newMessageRef, message).then(() => {
      this.newMessageContent = '';
    });
  }

  getUserName(id: string): string {
    const user = this.users[id];
    if (!user) return '';
    return user.name;
  }

  isCurrentUserMessage(senderId: string): boolean {
    const currentUser = this.authService.userSubject.value;
    if (!currentUser) return false;

    return senderId === currentUser.id;
  }

  getStorageImageSrc = getStorageImageSrc;
  formatTimestamp = formatTimestamp;
}
