import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  produtos: any;
  exchangeRate: number = 1;
  visible: boolean = false;
  visible2: boolean = false;
  visible_categoria: boolean = false;
  visible_produtos: boolean = false;


  formcompra: FormGroup;
  formcompra2: FormGroup;
  formCategoria: FormGroup;
  formProduto: FormGroup;
  listaCategorias: any[] = [];
  selectedCategoria: any;
  selectedProductId: number = 0; // Para armazenar o ID do produto selecionado

  constructor(private homeService: HomeService, private loginService: LoginService, private fb: FormBuilder, private router: Router) {
    this.formcompra = this.fb.group({
      quantidade: ['', Validators.required]
    });
    this.formcompra2 = this.fb.group({
      quantidade2: ['', Validators.required]
    });
    this.formCategoria = this.fb.group({
      descricao: ['', Validators.required]
    });
    this.formProduto = this.fb.group({
      descprod: ['', Validators.required],
      qtd: ['', Validators.required],
      valor: ['', Validators.required],
      categoria: ['', Validators.required]

    });
  }

  ngOnInit() {
    this.loadProdutos();
    this.loadExchangeRate();
    this.loadCategorias(); // Chama a função para carregar as categorias
  }

  loadCategorias() {
    this.homeService.getCategoria().subscribe(
      (data: any) => {
        // Verifique se os dados são realmente um array e mapeie para o formato esperado
        if (Array.isArray(data)) {
          this.listaCategorias = data.map(item => ({ descricao: item.descricao_cat, id: item.id_cat }));
          console.log("categorias:", this.listaCategorias);
        } else {
          console.error('Os dados retornados não são um array:', data);
        }
      },
      error => {
        console.error('Erro ao carregar categorias', error);
      }
    );
  }


  loadProdutos() {
    this.homeService.getProduto().subscribe(
      (data: any) => {
        this.produtos = data;
      },
      error => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  compra() {
    if (this.formcompra && this.formcompra.valid) {
      const quantidadeControl = this.formcompra.get('quantidade');
      if (quantidadeControl) {
        const quantidade = quantidadeControl.value;
        this.homeService.postCompra(this.selectedProductId, { quantidade }).subscribe(
          (response) => {
            console.log('Produto comprado com sucesso', response);
            this.visible = false; // Feche o diálogo após a compra
            this.loadProdutos(); // Recarregue os produtos
          },
          (error) => {
            console.error('Falha na compra', error);  // Trata o erro aqui
            if (error.status === 400) {
              console.error('Erro 400: Quantidade desejada não disponível');
            } else if (error.status === 404) {
              console.error('Erro 404: Produto não encontrado');
            } else {
              console.error('Erro desconhecido:', error);
            }
          }
        );
      } else {
        console.error('Controle de quantidade não encontrado');
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  compra_adicionar() {
    if (this.formcompra2 && this.formcompra2.valid) {
      const quantidadeControl = this.formcompra2.get('quantidade2'); // Corrigido para 'quantidade2'
      if (quantidadeControl) {
        const quantidade = quantidadeControl.value;
        this.homeService.postCompra_adicionar(this.selectedProductId, { quantidade }).subscribe(
          (response) => {
            console.log('Produto adicionado com sucesso', response);
            this.visible2 = false; // Feche o diálogo após a operação
            this.loadProdutos(); // Recarregue os produtos
          },
          (error) => {
            console.error('Falha ao adicionar produto', error);
            if (error.status === 400) {
              console.error('Erro 400: Quantidade desejada não disponível');
            } else if (error.status === 404) {
              console.error('Erro 404: Produto não encontrado');
            } else {
              console.error('Erro desconhecido:', error);
            }
          }
        );
      } else {
        console.error('Controle de quantidade não encontrado');
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  criarCategoria() {
    if (this.formCategoria && this.formCategoria.valid) {
      const descricaoControl = this.formCategoria.get('descricao');
      if (descricaoControl) {
        const descricao = descricaoControl.value;
        this.homeService.postCategoria({ descricao: descricao }).subscribe(
          (response) => {
            console.log('Categoria criada com sucesso', response);
            this.visible_categoria = false; // Feche o diálogo após a criação
            this.loadProdutos(); // Recarregue os produtos
          },
          (error) => {
            console.error('Falha ao criar categoria', error);
            if (error.status === 400) {
              console.error('Erro 400: Descrição da categoria inválida');
            } else {
              console.error('Erro desconhecido:', error);
            }
          }
        );
      } else {
        console.error('Controle de descrição não encontrado');
      }
    } else {
      console.error('Formulário de categoria inválido');
    }
  }

  loadExchangeRate() {
    this.homeService.getExchangeRate().subscribe(
      (rate: number) => {
        this.exchangeRate = rate;
      },
      error => {
        console.error('Erro ao carregar taxa de câmbio', error);
      }
    );
  }

  convertToUSD(valor: number): number {
    return valor * this.exchangeRate;
  }

  showDialog(produtoId: number) {
    this.selectedProductId = produtoId; // Defina o ID do produto selecionado
    this.visible = true;
    this.formcompra.reset(); // Redefina o formulário ao abrir o diálogo
  }

  showDialog2(produtoId: number) {
    this.selectedProductId = produtoId; // Defina o ID do produto selecionado
    this.visible2 = true; // Mostra o segundo diálogo
    this.formcompra2.reset(); // Redefina o formulário ao abrir o diálogo
  }

  criarProduto() {
    if (this.formProduto.valid && this.selectedCategoria) {
      const formData = this.formProduto.value;
      const produtoData = {
        descricao: formData.descprod,
        quantidade: formData.qtd,
        valor: formData.valor,
        id_cat: formData.categoria[0]['id'],
        id_login: localStorage.getItem('iduser'),
        img: "xxxx"  // Verifique se isso está sendo passado corretamente
      };

      this.homeService.postProduto(produtoData).subscribe(
        (response) => {
          console.log('Produto criado com sucesso', response);
          this.visible_produtos = false;
          this.loadProdutos();
        },
        (error) => {
          console.error('Erro ao criar produto', error);
        }
      );
    } else {
      console.error('Formulário inválido ou nenhuma categoria selecionada');
      console.log('Formulário:', this.formProduto.value);
      console.log('Categoria selecionada:', this.selectedCategoria);
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.formProduto.patchValue({
      file: file
    });
  }

  novaCategoria() {
    console.log('Nova Categoria clicada');
    this.visible_categoria = true; // Mostra o diálogo de categoria
  }

  cadastroProdutos() {
    console.log('Cadastro de Produtos clicado');
    this.visible_produtos = true; // Mostra o diálogo de cadastro de produtos
  }

  items = [
    {
      label: 'Categoria',
      icon: 'pi pi-fw pi-tag',
      items: [
        {
          label: 'Nova Categoria',
          icon: 'pi pi-fw pi-plus',
          command: () => {
            this.novaCategoria();
          }
        }
      ]
    },
    {
      label: 'Produtos',
      icon: 'pi pi-fw pi-shopping-cart',
      items: [
        {
          label: 'Cadastro de Produtos',
          icon: 'pi pi-fw pi-pencil',
          command: () => {
            this.cadastroProdutos();
          }
        }
      ]
    }
  ];

  logout() {
    // Lógica de logout aqui
    console.log('Usuário deslogado');
    // Redirecione para a página de login, por exemplo
    this.loginService.logout();

    this.router.navigate(['/login']);
  }




}
