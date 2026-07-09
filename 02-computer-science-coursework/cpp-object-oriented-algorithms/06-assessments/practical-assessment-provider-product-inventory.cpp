#include "pch.h"
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

class Proveedor {
private:
	string ruc;
	string razon_social;
	char categoria;
	string direccion;
	string telefono;
public:
	Proveedor() {}
	Proveedor(string ruc, string razon_social, char categoria, string direccion, string telefono) {
		this->ruc = toUpperString(ruc);
		this->razon_social = toUpperString(razon_social);
		this->categoria = toupper(categoria);
		this->direccion = toUpperString(direccion);
		this->telefono = toUpperString(telefono);
	}
	~Proveedor() {}

	static string toUpperString(const string& str) {
		string result = str;
		for (char& c : result) {
			c = toupper(c);
		}
		return result;
	}

	void setRuc(string ruc) {
		this->ruc = ruc;
	}
	void setRazon_Social(string razon_social) {
		this->razon_social = razon_social;
	}
	void setCategoria(char categoria) {
		this->categoria = categoria;
	}
	void setDireccion(string direccion) {
		this->direccion = direccion;
	}
	void setTelefono(string telefono) {
		this->telefono = telefono;
	}
	string getRuc() {
		return this->ruc;
	}
	string getRazon_Social() {
		return this->razon_social;
	}
	char getCategoria() {
		return this->categoria;
	}
	string getDireccion() {
		return this->direccion;
	}
	string getTelefono() {
		return this->telefono;
	}
};
class Producto {
private:
	Proveedor* proveedor;
	string id;
	string nombre;
	char tipo;
	int cantidad;
	char categoria;
	string año;
	int precio;
public:
	Producto() {}
	Producto(Proveedor* proveedor, const string& id, const string& nombre, char tipo, int cantidad, char categoria, const string& año, int precio)
		: proveedor(proveedor), id(toUpperString(id)), nombre(toUpperString(nombre)), tipo(toupper(tipo)), cantidad(cantidad),
		categoria(toupper(categoria)), año(año), precio(precio) {}
	~Producto() {
		delete proveedor;
	}
	static string toUpperString(const string& str) {
		string result = str;
		for (char& c : result) {
			c = toupper(c);
		}
		return result;
	}
	void setId(string id) {
		this->id = id;
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
	void setCategoria(char categoria) {
		this->categoria = categoria;
	}
	void setAño(string año) {
		this->año = año;
	}
	void setPrecio(int precio) {
		this->precio = precio;
	}
	string getId() {
		return this->id;
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
	char getCategoria() {
		return this->categoria;
	}
	string getAño() {
		return this->año;
	}
	int getPrecio() {
		return this->precio;
	}
	Proveedor* getProveedor() {
		return this->proveedor;
	}
};
class ListaProductos {
private:
	Producto** productos;
	int n;
public:
	ListaProductos() : n(0), productos(nullptr) {}
	~ListaProductos() {
		for (int i = 0; i < n; ++i) {
			delete productos[i];
		}
		delete[] productos;
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
	void modificarProducto(int indice, Producto* nuevo) {
		if (indice >= 0 && indice < n) {
			productos[indice] = nuevo;
		}
		else {
			cout << "\nEl indice no ha sido encontrado";
		}
	}
	void eliminarProducto(int indice) {
		if (indice >= 0 && indice < n) {
			Producto** copia = new Producto * [n - 1];
			delete productos[indice];
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
		else {
			cout << "\nEl indice especificado no ha sido encontrado";
		}
	}
	void eliminarProductosvencidos() {
		for (int i = 0; i < n; ++i) {
			if (stoi(productos[i]->getAño()) < 2020) {
				eliminarProducto(i);
			}
		}
	}
	void eliminarProductos_Herbalife() {
		for (int i = 0; i < n; ++i) {
			if (productos[i]->getProveedor()->getRazon_Social() == "HERBALIFE") {
				eliminarProducto(i);
			}
		}
	}
	void mostrarProductos_Cat_A_Natura() {
		for (int i = 0; i < n; ++i) {
			if (productos[i]->getProveedor()->getRazon_Social() == "NATURA" && productos[i]->getCategoria() == 'A') {
				cout << "ID: " << productos[i]->getId();
				cout << "\nNombre: " << productos[i]->getNombre();
				cout << "\nTipo: " << productos[i]->getTipo();
				cout << "\nCantidad: " << productos[i]->getCantidad();
				cout << "\nCategoria: " << productos[i]->getCategoria();
				cout << "\nAno: " << productos[i]->getAño();
				cout << "\nPrecio: " << productos[i]->getPrecio();
				cout << "\nRUC (Proveedor): " << productos[i]->getProveedor()->getRuc();
				cout << "\nTelefono (Proveedor): " << productos[i]->getProveedor()->getTelefono();
				cout << endl << endl;
			}
		}
	}
	void mostrarProductos() {
		for (int i = 0; i < n; ++i) {
			cout << "Producto ID: " << productos[i]->getId();
			cout << "\nNombre: " << productos[i]->getNombre();
			cout << "\nTipo: " << productos[i]->getTipo();
			cout << "\nCantidad: " << productos[i]->getCantidad();
			cout << "\nCategoria: " << productos[i]->getCategoria();
			cout << "\nAno: " << productos[i]->getAño();
			cout << "\nPrecio: " << productos[i]->getPrecio();

			// Aquí aseguramos que los datos del proveedor se muestren correctamente
			Proveedor* proveedor = productos[i]->getProveedor();
			if (proveedor != nullptr) {
				cout << "\nProveedor RUC: " << proveedor->getRuc();
				cout << "\nProveedor Razon Social: " << proveedor->getRazon_Social();
				cout << "\nProveedor Categoria: " << proveedor->getCategoria();
				cout << "\nProveedor Direccion: " << proveedor->getDireccion();
				cout << "\nProveedor Telefono: " << proveedor->getTelefono();
			}
			cout << endl << endl;
		}
	}
	int getN() {
		return n;
	}
};
int main() {
	// Variables Auxiliares
	int opcion;
	int indice;

	string ruc_Proveedor;
	string razon_social_Proveedor;
	char categoria_Proveedor;
	string direccion_Proveedor;

	string telefono_Proveedor;

	string id_Producto;
	string nombre_Producto;
	char tipo_Producto;
	int cantidad_Producto;
	char categoria_Producto;
	string año_Producto;
	int precio_Producto;
	// Objetos
	ListaProductos* ObjLista = new ListaProductos;
	Producto* ObjProducto;
	Proveedor* ObjProveedor;
	while (true) {
		system("cls");
		cout << "1. Insertar producto";
		cout << "\n2. Mostrar productos de categoria A y proveedor Natura";
		cout << "\n3. Modificar producto";
		cout << "\n4. Eliminar productos vencidos";
		cout << "\n5. Reportes";
		cout << "\n6. Eliminar productos de Herbalife";
		cout << "\n7. Salir";
		cout << endl;
		cin >> opcion;
		system("cls");
		switch (opcion) {
		case 1:
			cout << "Ingrese el RUC(Proveedor): ";
			cin >> ruc_Proveedor;
			cout << "Ingrese la razon social(Proveedor): ";
			cin >> razon_social_Proveedor;
			cout << "Ingrese la categoria(Proveedor): ";
			cin >> categoria_Proveedor;
			cout << "Ingrese la direccion(Proveedor): ";
			cin >> direccion_Proveedor;
			cout << "Ingrese el telefono(Proveedor): ";
			cin >> telefono_Proveedor;
			ObjProveedor = new Proveedor(ruc_Proveedor, razon_social_Proveedor, categoria_Proveedor, direccion_Proveedor, telefono_Proveedor);
			cout << "Ingrese el ID: ";
			cin >> id_Producto;
			cout << "Ingrese el nombre: ";
			cin >> nombre_Producto;
			cout << "Ingrese el tipo (P:Polvo, L:Liquido): ";
			cin >> tipo_Producto;
			cout << "Ingrese la cantidad: ";
			cin >> cantidad_Producto;
			cout << "Ingrese la categoria (A, B, C): ";
			cin >> categoria_Producto;
			cout << "Ingrese el ano: ";
			cin >> año_Producto;
			cout << "Ingrese el precio: ";
			cin >> precio_Producto;
			ObjProducto = new Producto(ObjProveedor, id_Producto, nombre_Producto, tipo_Producto, cantidad_Producto, categoria_Producto, año_Producto, precio_Producto);
			ObjLista->agregarProducto(ObjProducto);
			break;
		case 2:
			ObjLista->mostrarProductos_Cat_A_Natura();
			break;
		case 3:
			cout << "Ingrese el indice a modificar (1 - " << ObjLista->getN() << "): ";
			cin >> indice;

			cout << "Ingrese el RUC(Proveedor): ";
			cin >> ruc_Proveedor;
			cout << "Ingrese la razon social(Proveedor): ";
			cin >> razon_social_Proveedor;
			cout << "Ingrese la categoria(Proveedor): ";
			cin >> categoria_Proveedor;
			cout << "Ingrese la direccion(Proveedor): ";
			cin >> direccion_Proveedor;
			cout << "Ingrese el telefono(Proveedor): ";
			cin >> telefono_Proveedor;
			ObjProveedor = new Proveedor(ruc_Proveedor, razon_social_Proveedor, categoria_Proveedor, direccion_Proveedor, telefono_Proveedor);
			cout << "Ingrese el ID: ";
			cin >> id_Producto;
			cout << "Ingrese el nombre: ";
			cin >> nombre_Producto;
			cout << "Ingrese el tipo (P:Polvo, L:Liquido): ";
			cin >> tipo_Producto;
			cout << "Ingrese la cantidad: ";
			cin >> cantidad_Producto;
			cout << "Ingrese la categoria (A, B, C): ";
			cin >> categoria_Producto;
			cout << "Ingrese el ano: ";
			cin >> año_Producto;
			cout << "Ingrese el precio: ";
			cin >> precio_Producto;
			ObjProducto = new Producto(ObjProveedor, id_Producto, nombre_Producto, tipo_Producto, cantidad_Producto, categoria_Producto, año_Producto, precio_Producto);
			ObjLista->modificarProducto(indice - 1, ObjProducto);
			break;
		case 4:
			ObjLista->eliminarProductosvencidos();
			break;
		case 5:
			ObjLista->mostrarProductos();
			break;
		case 6:
			ObjLista->eliminarProductos_Herbalife();
			break;
		case 7:
			cout << "Saliendo...";
			return 0;
		default:
			cout << "Opcion invalida";
			break;
		}
		system("pause>0");
	}
}
