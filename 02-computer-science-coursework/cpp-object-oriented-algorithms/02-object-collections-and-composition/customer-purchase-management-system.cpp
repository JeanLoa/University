#include <iostream>
#include <string>
#include <conio.h>
using namespace std;

class Cliente {
private:
	// Arreglo para almacenar los clientes
	Cliente** clientes;
	int n;

	// Variables para cliente
	string DNI;
	string nombre;
public:
	Cliente(): clientes(nullptr), n(0){}
	Cliente(string DNI, string nombre) : clientes(nullptr), n(0), DNI(DNI), nombre(nombre){}
	~Cliente(){}
	void setDNI(string DNI) {
		this->DNI = DNI;
	}
	void setNombre(string nombre) {
		this->nombre = nombre;
	}
	void setCliente(Cliente* nuevo, int indice) {
		clientes[indice] = nuevo;
	}
	string getDNI() {
		return this->DNI;
	}
	string getNombre() {
		return this->nombre;
	}
	string getNombreporIndice(int indice) {
		return clientes[indice]->nombre;
	}
	Cliente* getCliente(int indice) {
		return clientes[indice];
	}
	void agregarCliente(Cliente* nuevo) {
		system("cls");
		Cliente** copia = new Cliente*[n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = clientes[i];
		}
		copia[n] = nuevo;
		delete[] clientes;
		clientes = copia;
		++n;
	}
	void eliminarCLiente(int indice) {
		system("cls");
		Cliente** copia = new Cliente * [n - 1];
		if (indice >= 0 && indice < n) {
			delete clientes[indice];
		}
		else {
			cout << "El indice especificado no ha sido encontrado";
			return;
		}
		for (int i = indice; i < n-1; ++i) {
			clientes[i] = clientes[i + 1];
		}
		for (int i = 0; i < n-1; ++i) {
			copia[i] = clientes[i];
		}
		delete[] clientes;
		clientes = copia;
		--n;
	}
	void mostrarClientes() {
		system("cls");
		for (int i = 0; i < n; ++i) {
			cout << "Cliente " << i + 1 << ":";
			cout << "\nNombre: " << clientes[i]->getNombre();
			cout << "\nDNI: " << clientes[i]->getDNI();
			cout << endl << endl;
		}
	}
	int getN() {
		return n;
	}
};

class Producto {
private:
	// Arreglo para almacenar los productos
	Producto** productos;
	int n;

	// Variables de producto
	string codProducto;
	string nombre;
	char tipo;
	int cantidad;
	int precio;
public:
	Producto() : productos(nullptr), n(0) {};
	Producto(string cod, string nombre, char tipo, int cantidad, int precio): codProducto(cod), nombre(nombre), tipo(tipo), cantidad(cantidad), precio(precio) {}
	~Producto(){}
	void setCod(string cod) {
		this->codProducto = cod;
	}
	void setNombre(string nombre) {
		this->nombre = nombre;
	}
	void setTipo(char tipo) {
		this->tipo = tipo;
	}
	void setCantidad(int cantidad) {
		this->cantidad = cantidad;
	}
	void setPrecio(int precio) {
		this->precio = precio;
	}
	void setProducto(Producto* nuevo, int indice) {
		productos[indice] = nuevo;
	}
	string getCod() {
		return this->codProducto;
	}
	string getNombre() {
		return this->nombre;
	}
	char getTipo() {
		return this->tipo;
	}
	int getCantidad() {
		return this->cantidad;
	}
	int getPrecio() {
		return this->precio;
	}
	Producto* getProducto(int indice) {
		return productos[indice];
	}
	void agregarProducto(Producto* nuevo) {
		Producto** copia = new Producto * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = productos[i];
		}
		copia[n] = nuevo;
		delete[] productos;
		productos = copia;
		++n;
	}
	void eliminarProducto(int indice) {
		system("cls");
		Producto** copia = new Producto * [n - 1];
		if (indice >= 0 && indice < n) {
			delete productos[indice];
		}
		else {
			cout << "El indice especificado no ha sido encontrado";
			return;
		}
		for (int i = indice; i < n - 1; ++i) {
			productos[i] = productos[i + 1];
		}
		for (int i = 0; i < n - 1; ++i) {
			copia[i] = productos[i];
		}
		delete[] productos;
		productos = copia;
		--n;
	}
	void mostrarProductos() {
		system("cls");
		for (int i = 0; i < n; ++i) {
			cout << "Producto " << i + 1 << ": ";
			cout << "\nCodigo: " << productos[i]->getCod();
			cout << "\nNombre: " << productos[i]->getNombre();
			cout << "\nTipo: " << productos[i]->getTipo();
			cout << "\nCantidad: " << productos[i]->getCantidad();
			cout << "\nPrecio: " << productos[i]->getPrecio();
			cout << endl << endl;
		}
	}
	int getN() {
		return n;
	}
};

class Compra {
private:
	// Arreglo para almacenar la información de las compras
	Compra** compras;
	int n;

	// Variables de compra
	string id;
	string fecha;
	Cliente* cliente;
	Producto* producto;
public:
	Compra(): compras(nullptr), cliente(nullptr), producto(nullptr), n(0) {}
	Compra(string id, string fecha, Cliente* cliente, Producto* producto, int indice_Cliente, int indice_Producto): compras(nullptr), cliente(nullptr), producto(nullptr), n(0) {
		this->id = id;
		int dia, mes, año;
		bool valido_Fecha = false;
		dia = stoi(fecha.substr(0, 2));
		mes = stoi(fecha.substr(3, 2));
		año = stoi(fecha.substr(6, 2));
		if (dia >= 1 && dia <= 30) {
			if (mes >= 1 && mes <= 12) {
				if (año >= 0 && año <= 24) {
					valido_Fecha = true;
				}
			}
		}
		if (valido_Fecha) {
			this->fecha = fecha;
		}

		this->cliente = cliente;
		this->producto = producto;
	}
	~Compra(){
		delete cliente;
		delete producto;
		delete[] compras;
	}
	void setId(string id) {
		this->id = id;
	}
	void setFecha(string fecha) {
		this->fecha = fecha;
	}
	void setCliente(Cliente* cliente) {
		this->cliente = cliente;
	}
	void setProducto(Producto* producto) {
		this->producto = producto;
	}
	string getId() {
		return this->id;
	}
	string getFecha() {
		return this->fecha;
	}
	Cliente* getCliente() {
		return this->cliente;
	}
	Producto* getProducto() {
		return this->producto;
	}
	void agregarCompra(Compra* nuevo) {
		Compra** copia = new Compra * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = compras[i];
		}
		delete[] compras;
		copia[n] = nuevo;
		compras = copia;
		++n;
	}
	void eliminarCompra(int indice) {
		system("cls");
		Compra** copia = new Compra * [n - 1];
		if (indice >= 0 && indice < n) {
			delete compras[indice];
		}
		else {
			cout << "El indice especificado no ha sido encontrado";
			return;
		}
		for (int i = indice; i < n - 1; ++i) {
			compras[i] = compras[i + 1];
		}
		for (int i = 0; i < n - 1; ++i) {
			copia[i] = compras[i];
		}
		delete[] compras;
		compras = copia;
		--n;
	}
	void mostrarCompras() {
		system("cls");
		for (int i = 0; i < n; ++i) {
			cout << "Compra " << i + 1 << ":";
			cout << "\nId de compra: " << compras[i]->getId();
			cout << "\nFecha: " << compras[i]->getFecha();
			cout << "\nNombre del cliente: " << compras[i]->getCliente()->getNombre();
			cout << "\nCodigo del producto: " << compras[i]->getProducto()->getCod();
			cout << "\nNombre del producto: " << compras[i]->getProducto()->getNombre();
			cout << endl << endl;
		}
	}
	int getN() {
		return n;
	}
};

int main() {
	Cliente* ObjListaClientes = new Cliente;
	Producto* ObjListaProductos = new Producto;
	Compra* ObjListaCompras = new Compra;
/*
Variables de almacenamiento
*/
	int indice = 1;
	int opcion;
	bool Comprado;
	// Variables para los clientes
	string nombreCliente;
	string DNI;
	Cliente* cliente;

	// Variables para los productos
	string codProducto;
	string nombreProducto;
	char tipoProducto;
	int cantidadProducto;
	int precioProducto;
	Producto* producto;

	// Variables para las compras
	string idCompra;
	string fechaCompra;
	Compra* compra;

	do {
		system("cls");
		cin.clear();
		cout << "Ingrese su nombre: ";
		cin >> nombreCliente;
		cout << "Ingrese su DNI: ";
		cin >> DNI;
		cliente = new Cliente(DNI, nombreCliente);
		ObjListaClientes->agregarCliente(cliente);
	} while (cin.fail());
	while (true) {
		system("cls");
		cout << "Interactuando como " << ObjListaClientes->getNombreporIndice(indice - 1);
		cout << "\n1. Ingresar cliente";
		cout << "\n2. Ingresar producto";
		cout << "\n3. Comprar";
		cout << "\n4. Mostrar clientes";
		cout << "\n5. Mostrar productos";
		cout << "\n6. Mostrar compras";
		cout << "\n7. Selecionar cliente";
		cout << "\n8. Eliminar cliente";
		cout << "\n9. Eliminar producto";
		cout << "\n10. Eliminar compra";
		cout << "\n0. Salir";
		cout << endl;
		cin >> opcion;
		system("cls");
		switch (opcion) {
		case 1:
			do {
				system("cls");
				cin.clear();
				cout << "Ingresa el nombre: ";
				cin >> nombreCliente;
				cout << "Ingresa el DNI: ";
				cin >> DNI;
			} while (cin.fail());
			cliente = new Cliente(DNI, nombreCliente);
			ObjListaClientes->agregarCliente(cliente);
			break;
		case 2:
			do {
				system("cls");
				cin.clear();
				cout << "Ingresa el codigo del producto: ";
				cin >> codProducto;
				cout << "Ingresa el nombre del producto: ";
				cin >> nombreProducto;
				cout << "Ingrese el tipo de producto (A-B-C): ";
				cin >> tipoProducto;
				cout << "Ingresa la cantidad de productos: ";
				cin >> cantidadProducto;
				cout << "Ingresa el precio del producto: ";
				cin >> precioProducto;
			} while (cin.fail());
			producto = new Producto(codProducto, nombreProducto, tipoProducto, cantidadProducto, precioProducto);
			ObjListaProductos->agregarProducto(producto);
			break;
		case 3:
			do {
				system("cls");
				Comprado = false;
				if (ObjListaProductos->getN() > 0) {
					ObjListaProductos->mostrarProductos();
					cout << "Selecione el producto que desea comprar (1 - " << ObjListaProductos->getN() << "): ";
					cin >> opcion;
					if (opcion > 0 && opcion <= ObjListaProductos->getN()) {
						cout << "Ingrese el ID de compra: ";
						cin >> idCompra;
						cout << "Ingrese la fecha: ";
						cin >> fechaCompra;
						compra = new Compra(idCompra, fechaCompra, ObjListaClientes->getCliente(indice - 1), ObjListaProductos->getProducto(opcion - 1), indice-1, opcion-1);
						ObjListaCompras->agregarCompra(compra);
						Comprado = true;
					}
					else {
						cout << "\nIngrese una opcion valida";
					}
				}
				else {
					cout << "\nNo hay productos disponibles";
					Comprado = true;
				}
				system("pause>0");
			} while (!Comprado);
			break;
		case 4:
			ObjListaClientes->mostrarClientes();
			break;
		case 5:
			ObjListaProductos->mostrarProductos();
			break;
		case 6:
			ObjListaCompras->mostrarCompras();
			break;
		case 7:
			do {
				system("cls");
				cin.clear();
				ObjListaClientes->mostrarClientes();
				
				cout << "Ingrese que cliente selecionar (1 - " << ObjListaClientes->getN() << "): ";
				cin >> indice;
			} while (cin.fail() || (indice - 1 < 0 && indice - 1 >= ObjListaClientes->getN()));
			break;
		case 8:
			do {
				system("cls");
				cin.clear();
				ObjListaClientes->mostrarClientes();
				cout << "Ingrese el cliente a eliminar (1 - " << ObjListaClientes->getN() << "): ";
				cin >> opcion;
			} while (cin.fail() || (opcion - 1 < 0 && opcion - 1 >= ObjListaClientes->getN()));
			ObjListaClientes->eliminarCLiente(opcion - 1);
			break;
		case 9:
			do {
				system("cls");
				cin.clear();
				ObjListaProductos->mostrarProductos();
				
				cout << "Ingrese el producto a eliminar (1 - " << ObjListaProductos->getN() << "): ";
				cin >> opcion;
			} while (cin.fail() || (opcion - 1 < 0 && opcion - 1 >= ObjListaProductos->getN()));
			ObjListaProductos->eliminarProducto(opcion - 1);
			break;
		case 10:
			do {
				system("cls");
				cin.clear();
				ObjListaCompras->mostrarCompras();
				
				cout << "Ingrese la compra a eliminar a eliminar (1 - " << ObjListaCompras->getN() << ")";
				cin >> opcion;
			} while (cin.fail() || (opcion - 1 < 0 && opcion - 1 >= ObjListaCompras->getN()));
			ObjListaCompras->eliminarCompra(opcion - 1);
			break;
		case 0: 
			cout << "Saliendo del programa...\n";
			return 0;
			break;
		default:
			cout << "Ingrese una opcion valida";
			break;
		}
		system("pause>0");
	}
	return 0;
}
