import { CartService } from './../../services/domain/cart.service';
import { PedidoDTO } from './../../models/pedido-dto';
import { StorageService } from './../../services/storage.service';
import { EnderecoDTO } from './../../models/endereco.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-pick-adress',
  templateUrl: 'pick-adress.html',
})
export class PickAdressPage {

  items: EnderecoDTO[];

  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService
    ) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
   if (localUser && localUser.email) {
     this.clienteService.findByEmail(localUser.email)
     .subscribe(response => {
       this.items = response['enderecos'];

      let cart = this.cartService.getCart();

       this.pedido = {
         cliente: {id: response['id']},
         enderecoDeEntrega: null,
         pagamento: null,
         items: cart.items.map(x => {return {quantidade: x.quantidade, produto:{id: x.produto.id}}})
       }
     },
     error =>{
       if (error.status == 403) {
        this.navCtrl.setRoot('Homepage');
       }
     });
   } else {
    this.navCtrl.setRoot('Homepage');
   }
  }

  nextPage(item: EnderecoDTO){
    this.pedido.enderecoDeEntrega = {id: item.id};
    this.navCtrl.push('PaymentPage', {pedido: this.pedido});
    console.log(this.pedido);
  }

}