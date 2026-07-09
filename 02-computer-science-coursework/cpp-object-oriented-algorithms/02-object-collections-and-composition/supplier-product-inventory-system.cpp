#include <iostream>
#include <conio.h>
#include <iomanip>
#include <Windows.h>

using namespace std;

// Clase Proveedor
class Proveedor
{
private:
	// Variables
	string ruc;
	string razon_social;
	char categoria;
	string direccion;
	string telefono;
public:
	// Constructor
	Proveedor() {}
	Proveedor(string ruc, string razon_social, char categoria, string direccion, string telefono) :
		ruc(ruc), razon_social(razon_social), categoria(categoria), direccion(direccion), telefono(telefono) {}
	// Destructor
	~Proveedor() {}
	// Metodos
	void setruc(string ruc) { this->ruc = ruc; }
	void setrazonsocial(string razon) { this->razon_social = razon; }
	void setcategoria(char categoria) { this->categoria = categoria; }
	void setdireccion(string direccion) { this->direccion = direccion; }
	void settelefono(string telefono) { this->telefono = telefono; }

	string getruc() { return ruc; }
	string getrazonsocial() { return razon_social; }
	char getcategoria() { return categoria; }
	string getdireccion() { return direccion; }
	string gettelefono() { return telefono; }
};

// Clase Producto
class Producto {
private:
	// Variables
	string id_producto;
	string nombre;
	char tipo;
	int cantidad;
	char categoria;
	int año;
	int precio;
public:
	// Constructor
	Producto() {}
	Producto(string id_producto, string nombre, char tipo, int cantidad, char categoria, int año, int precio)
		: id_producto(id_producto), nombre(nombre), tipo(tipo), cantidad(cantidad), categoria(categoria), año(año), precio(precio) {}
	// Destructor
	~Producto() {}

	// Metodos
	void setidproducto(string id) {
		for (char& c : id) {
			c = toupper(c);
		}
		this->id_producto = id;
	}
	void setnombre(string nombre) {
		for (char& c : nombre) {
			c = toupper(c);
		}
		this->nombre = nombre;
	}
	void settipo(char tipo) {
		tipo = toupper(tipo);
		if (tipo == 'P' || tipo == 'L') {
			this->tipo = tipo;
		}
		else {
			cout << "\nNo se pudo establecer el tipo";
		}
	}
	void setcantidad(int cantidad) {
		if (cantidad > 0) {
			this->cantidad = cantidad;
		}
		else {
			cout << "\nNo se pudo establecer la cantidad";
		}
	}
	void setcategoria(char categoria) {
		categoria = toupper(categoria);
		if (categoria == 'A' || categoria == 'B' || categoria == 'C') {
			this->categoria = categoria;
		}
		else {
			cout << "\nNo se pudo establecer la categoria";
		}
	}
	void setaño(int año) {
		if (año > 2000 && año < 2024) {
			this->año = año;
		}
		else {
			cout << "\nNo se pudo establecer el ano";
		}
	}
	void setprecio(int precio) {
		if (precio > 0) {
			this->precio = precio;
		}
		else {
			cout << "\nNo se pudo establecer el precio del producto";
		}
	}

	string getidproducto() { return id_producto; }
	string getnombre() { return nombre; }
	char gettipo() { return tipo; }
	int getcantidad() { return cantidad; }
	char getcategoria() { return categoria; }
	int getaño() { return año; }
	int getprecio() { return precio; }
};

// Clase Lista
class Lista
{
private:
	// Variables de Almacenamiento
	int n;
	int m;
	Proveedor** proveedores = new Proveedor * [n];
	Producto** productos = new Producto * [m];
public:
	Lista() : n(0), m(0) {}
	~Lista() { // Destructor to free allocated memory.
		for (int i = 0; i < n; ++i) {
			delete proveedores[i];
		}
		delete[] proveedores;

		for (int i = 0; i < m; ++i) {
			delete productos[i];
		}
		delete[] productos;
	}
	// Metodos para Proveedores
	void setRuc(string ruc, int indice) {
		proveedores[indice - 1]->setruc(ruc);
	}
	void setRazonSocial(string razon, int indice) {
		proveedores[indice - 1]->setrazonsocial(razon);
	}
	void setCategoria_Prov(char categoria, int indice) {
		proveedores[indice - 1]->setcategoria(categoria);
	}
	void setDireccion(string direccion, int indice) {
		proveedores[indice - 1]->setdireccion(direccion);
	}
	void setTelefono(string telefono, int indice) {
		proveedores[indice - 1]->settelefono(telefono);
	}
	string getRuc(int indice) { return proveedores[indice]->getruc(); }
	string getRazonSocial(int indice) { return proveedores[indice]->getrazonsocial(); }
	char getCategoria_Prov(int indice) { return proveedores[indice]->getcategoria(); }
	string getDireccion(int indice) { return proveedores[indice]->getdireccion(); }
	string getTelefono(int indice) { return proveedores[indice]->gettelefono(); }

	// Metodos para Productos
	void setId(string id, int indice) {
		productos[indice - 1]->setidproducto(id);
	}
	void setNombre(string nombre, int indice) {
		productos[indice - 1]->setnombre(nombre);
	}
	void setTipo(char tipo, int indice) {
		productos[indice - 1]->settipo(tipo);
	}
	void setCantidad(int cantidad, int indice) {
		productos[indice - 1]->setcantidad(cantidad);
	}
	void setCategoria_Prod(char categoria, int indice) {
		productos[indice - 1]->setcategoria(categoria);
	}
	void setAño(int año, int indice) {
		productos[indice - 1]->setaño(año);
	}
	void setPrecio(int precio, int indice) {
		productos[indice - 1]->setprecio(precio);
	}
	string getId(int indice) { return productos[indice - 1]->getidproducto(); }
	string getNombre(int indice) { return productos[indice - 1]->getnombre(); }
	char getTipo(int indice) { return productos[indice - 1]->gettipo(); }
	int getCantidad(int indice) { return productos[indice - 1]->getcantidad(); }
	char getCategoria_Prod(int indice) { return productos[indice - 1]->getcategoria(); }
	int getAño(int indice) { return productos[indice - 1]->getaño(); }
	int getPrecio(int indice) { return productos[indice - 1]->getprecio(); }

	// Metodos de contenido
	void InsertarProveedor(Proveedor* proveedor) {
		Proveedor** copia = new Proveedor * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = proveedores[i];
		}
		copia[n] = proveedor;
		delete[] proveedores;
		proveedores = copia;
		++n;
	}
	void InsertarProducto(Producto* producto) {
		Producto** copia = new Producto * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = productos[i];
		}
		copia[n] = producto;
		delete[] productos;
		productos = copia;
		++m;
	}
	void ModificarProveedor(Proveedor* proveedor, int indice) {
		if (indice > 0 && indice <= n) {
			proveedores[indice - 1] = proveedor;
		}
		else {
			cout << "El indice no ha sido encontrado";
		}
	}
	void ModificarProducto(Producto* producto, int indice) {
		if (indice > 0 && indice <= n) {
			productos[indice - 1] = producto;
		}
		else {
			cout << "El indice no ha sido encontrado";
		}
	}
	void EliminarProveedor(int indice) {
		Proveedor** copia = new Proveedor*;
		if (indice > 0 && indice <= n) {
			delete proveedores[indice - 1];
			for (int i = indice - 1; i < n; ++i) {
				productos[i] = productos[i + 1];
			}
			for (int i = 0; i < n; ++i) {
				copia[i] = proveedores[i];
			}
			delete[] proveedores;
			proveedores = copia;
			--n;
		}
		else {
			cout << "El indice no ha sido encontrado";
		}
	}
	void EliminarProducto(int indice) {
		Producto** copia = new Producto*;
		if (indice > 0 && indice <= n) {
			delete productos[indice - 1];
			for (int i = indice - 1; i < n; ++i) {
				productos[i] = productos[i + 1];
			}
			for (int i = 0; i < n; ++i) {
				copia[i] = productos[i];
			}
			delete[] productos;
			productos = copia;
			--m;
		}
		else {
			cout << "El indice no ha sido encontrado";
		}
	}
	void MostrarInformacionProveedores(int i) {
		cout << "\nProveedor " << i + 1 << ":";
		cout << "\nRuc: " << proveedores[i]->getruc();
		cout << "\nRazon social: " << proveedores[i]->getrazonsocial();
		cout << "\nCategoria: " << proveedores[i]->getcategoria();
		cout << "\nDireccion: " << proveedores[i]->getdireccion();
		cout << "\nTelefono: " << proveedores[i]->gettelefono();
	}
	void MostrarInformacionProductos(int i) {
		cout << "\nProducto " << i + 1 << ":";
		cout << "\nID: " << productos[i]->getidproducto();
		cout << "\nNombre: " << productos[i]->getnombre();
		cout << "\nTipo: " << productos[i]->gettipo();
		cout << "\nCantidad: " << productos[i]->getcantidad();
		cout << "\nCategoria: " << productos[i]->getcategoria();
		cout << "\nAño: " << productos[i]->getaño();
		cout << "\nPrecio: " << productos[i]->getprecio();
	}

	int getCantidadenProveedores() {
		return n;
	}
	int getCantidadenProductos() {
		return m;
	}
};

int main() {
	// Variables para el Proveedor
	string ruc;
	string razon_social;
	char categoria_Prov;
	string direccion;
	string telefono;
	// Variables para el Producto
	string id_producto;
	string nombre;
	char tipo;
	int cantidad;
	char categoria_Prod;
	int año;
	int precio;
	// Declaración de Clases
	Lista lista;
	Proveedor* proveedor;
	Producto* producto;
	// Variables Auxiliares
	int indice;
	int input;
	bool Salir;
	int cantidadProductos;
	int cantidadProveedores;
	int cantidadMaxima;
	while (true) {
		system("cls");
		cantidadProductos = lista.getCantidadenProductos();
		cantidadProveedores = lista.getCantidadenProveedores();
		cantidadMaxima = max(cantidadProductos, cantidadProveedores);
		Salir = false;
		cout << "1. Insertar producto";
		cout << "\n2. Insertar proveedor";
		cout << "\n3. Modificar producto";
		cout << "\n4. Eliminar productos vencidos";
		cout << "\n5. Reportes (mostrar todos los productos en stock con sus respectivos proveedores)";
		cout << "\n6. Mostrar productos de categoria 'A' que sean de Natura";
		cout << "\n7. Eliminar productos de Herbalife";
		cout << "\n8. Salir";
		input = _getch() - '0';
		switch (input) {
		case 1:
			do {
				system("cls");
				cin.clear();
				cout << "Producto:";
				cout << "\nIngrese el ID: ";
				cin >> id_producto;
				cout << "\nIngrese el nombre: ";
				cin >> nombre;
				cout << "\nIngrese el tipo (P:Polvo - L:Liquido): ";
				cin >> tipo;
				cout << "\nIngrese la cantidad: ";
				cin >> cantidad;
				cout << "\nIngrese la categoria (A, B, C): ";
				cin >> categoria_Prov;
				cout << "\nIngrese el ano: ";
				cin >> año;
				cout << "\nIngrese el precio: ";
				cin >> precio;
			} while (cin.fail());
			do {
				system("cls");
				cin.clear();
				cout << "Proveedor: ";
				cout << "\nIngrese el RUC: ";
				cin >> ruc;
				cout << "\nIngrese la razon social: ";
				cin >> razon_social;
				cout << "\nIngrese la categoria: ";
				cin >> categoria_Prod;
				cout << "\nIngrese la direccion: ";
				cin >> direccion;
				cout << "\nIngrese el telefono: ";
				cin >> telefono;
			} while (cin.fail());
			proveedor = new Proveedor(ruc, razon_social, categoria_Prov, direccion, telefono);
			producto = new Producto(id_producto, nombre, tipo, cantidad, categoria_Prod, año, precio);
			lista.InsertarProducto(producto);
			lista.InsertarProveedor(proveedor);
			break;
		case 2:
			do {
				system("cls");
				cin.clear();
				cout << "Ingrese el RUC: ";
				cin >> ruc;
				cout << "\nIngrese la razon social: ";
				cin >> razon_social;
				cout << "\nIngrese la categoria: ";
				cin >> categoria_Prov;
				cout << "\nIngrese la direccion: ";
				cin >> direccion;
				cout << "\nIngrese el telefono: ";
				cin >> telefono;
			} while (cin.fail());
			proveedor = new Proveedor(ruc, razon_social, categoria_Prov, direccion, telefono);
			lista.InsertarProveedor(proveedor);
			break;
		case 3:
			cout << "Ingrese que modificar (1: Proveedor, 2: Producto): ";
			cin >> input;
			if (input == 1) {
				cout << "Ingrese el indice a modificar (1 - " << lista.getCantidadenProveedores() << "): ";
				cin >> indice;
				if (indice <= lista.getCantidadenProveedores() && indice > 0) {
					// Menu para modificar proveedores
					while (!Salir) {
						system("cls");
						cout << "1. Modificar todo";
						cout << "2. Modificar ruc";
						cout << "3. Modificar razon social";
						cout << "4. Modificar categoria";
						cout << "5. Modificar direccion";
						cout << "6. Modificar telefono";
						cout << "7. Salir";
						input = _getch() - '0';
						system("cls");
						switch (input) {
						case 1:
							do {
								system("cls");
								cin.clear();
								cout << "Ingrese el RUC: ";
								cin >> ruc;
								cout << "\nIngrese la razon social: ";
								cin >> razon_social;
								cout << "\nIngrese la categoria: ";
								cin >> categoria_Prov;
								cout << "\nIngrese la direccion: ";
								cin >> direccion;
								cout << "\nIngrese el telefono: ";
								cin >> telefono;
							} while (cin.fail());
							proveedor = new Proveedor(ruc, razon_social, categoria_Prov, direccion, telefono);
							lista.ModificarProveedor(proveedor, indice);
							break;
						case 2:
							cout << "Ingrese RUC: ";
							cin >> ruc;
							lista.setRuc(ruc, indice);
							break;
						case 3:
							cout << "Ingrese la razon social: ";
							cin >> razon_social;
							lista.setRazonSocial(razon_social, indice);
							break;
						case 4:
							cout << "Ingrese la categoria: ";
							cin >> categoria_Prov;
							lista.setCategoria_Prov(categoria_Prov, indice);
							break;
						case 5:
							cout << "Ingrese la direccion: ";
							cin >> direccion;
							break;
						case 6:
							cout << "Ingrese el telefono: ";
							cin >> telefono;
							break;
						case 7:
							cout << "Saliendo...";
							Sleep(500);
							Salir = true;
							break;
						default:
							break;
						}
						system("pause>0");
					}
				}
				else {
					cout << "\nIndice no encontrado";
				}
			}
			else if (input == 2) {
				cout << "Ingrese el indice a modificar (1 - " << lista.getCantidadenProductos() << "): ";
				cin >> indice;
				// Menu para modificar productos
				while (!Salir) {
					system("cls");
					cout << "1. Modificar todo";
					cout << "\n2. Modificar ID";
					cout << "\n3. Modificar nombre";
					cout << "\n4. Modificar tipo";
					cout << "\n5. Modificar cantidad";
					cout << "\n6. Modificar categoria";
					cout << "\n7. Modificar ano";
					cout << "\n8. Modificar precio";
					cout << "\n9. Salir";
					input = _getch() - '0';
					system("cls");
					switch (input) {
					case 1:
						do {
							system("cls");
							cin.clear();
							cout << "Ingrese el ID: ";
							cin >> id_producto;
							cout << "\nIngrese el nombre: ";
							cin >> nombre;
							cout << "\nIngrese el tipo: ";
							cin >> tipo;
							cout << "\nIngrese la cantidad: ";
							cin >> cantidad;
							cout << "\nIngrese la categoria: ";
							cin >> categoria_Prod;
							cout << "\nIngrese el ano: ";
							cin >> año;
							cout << "\nIngrese el precio";
							cin >> precio;
						} while (cin.fail());
						producto = new Producto(id_producto, nombre, tipo, cantidad, categoria_Prod, año, precio);
						lista.ModificarProducto(producto, indice);
						break;
					case 2:
						cout << "Ingrese el ID: ";
						cin >> id_producto;
						lista.setId(id_producto, indice);
						break;
					case 3:
						cout << "Ingrese el nombre: ";
						cin >> nombre;
						lista.setNombre(nombre, indice);
						break;
					case 4:
						cout << "Ingrese el tipo (P: Polvo, L: Liquido): ";
						cin >> tipo;
						lista.setTipo(tipo, indice);
						break;
					case 5:
						cout << "Ingrese la cantidad: ";
						cin >> cantidad;
						lista.setCantidad(cantidad, indice);
						break;
					case 6:
						cout << "Ingrese la categoria: ";
						cin >> categoria_Prod;
						lista.setCategoria_Prod(categoria_Prod, indice);
					case 7:
						cout << "Ingrese el ano: ";
						cin >> año;
						lista.setAño(año, indice);
						break;
					case 8:
						cout << "Ingrese el precio: ";
						cin >> precio;
						lista.setPrecio(precio, indice);
						break;
					case 9:
						cout << "Saliendo...";
						Salir = true;
						break;
					default:
						cout << "Opcion invalida";
						break;
					}
					system("pause>0");
				}
			}
			else {
				cout << "\nOpcion invalida";
			}
			system("pause>0");
			break;
		case 4:
			for (int i = 0; i < lista.getCantidadenProductos(); ++i) {
				// Eliminar producto si fue creado antes del 2020
				if (lista.getAño(i + 1) < 2020) {
					lista.EliminarProducto(i + 1);
				}
			}
			break;
		case 5:
			system("cls");
			for (int i = 0; i < cantidadMaxima; ++i) {
				// Mostrar información del producto si existe en esa posición
				if (i < cantidadProductos) {
					lista.MostrarInformacionProductos(i);
				}

				// Mostrar información del proveedor si existe en esa posición
				if (i < cantidadProveedores) {
					lista.MostrarInformacionProveedores(i);
				}

				// Separador para diferenciar entre iteraciones
				cout << "\n--------------------------\n";
			}
			break;
		case 6:
			for (int i = 0; i < lista.getCantidadenProductos(); ++i) {
				// Mostrar informacion si la categoria es A y su proveedor Natura
				if (lista.getCategoria_Prov(i + 1) == 'A' && lista.getNombre(i + 1) == "NATURA") {
					lista.MostrarInformacionProductos(i);
				}
			}
			break;
		case 7:
			for (int i = 0; i < cantidadMaxima; ++i) {
				// Eliminar producto y proveedor si el proveedor es Herbalife
				if (lista.getNombre(i) == "HERBALIFE") {
					lista.EliminarProducto(i + 1);
					lista.EliminarProveedor(i + 1);
				}
			}
			break;
		case 8:
			cout << "\nSaliendo del programa...";
			Sleep(500);
			return 0;
			break;
		default:
			cout << "\nOpcion invalida";
			break;
		}
		system("pause>0");
	}
}
