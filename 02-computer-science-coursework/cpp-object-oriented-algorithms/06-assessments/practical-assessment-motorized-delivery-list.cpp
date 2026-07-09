#include "pch.h"
#include <iostream>
#include <iomanip>
#include <string>
#include <conio.h>

using namespace System;
using namespace std;

class Motorizado {
private:
  string nombre;
  string apellido;
  string placa;
  string kilometraje;
  string empresa;
  float precio;
public:
  Motorizado(){}
  Motorizado(string nombre, string apellido, string placa, string kilometraje, string empresa){
    for (char& c : nombre) {
      c = toupper(c);
    }
    for (char& c : apellido) {
      c = toupper(c);
    }
    for (char& c : placa) {
      c = toupper(c);
    }
    for (char& c : kilometraje) {
      c = toupper(c);
    }
    for (char& c : empresa) {
      c = toupper(c);
    }
    this->nombre = nombre;
    this->apellido = apellido;
    this->placa = placa;
    this->kilometraje = kilometraje;
    this->empresa = empresa;
  }
  ~Motorizado(){}
  void setNombre(string nombre) {
    this->nombre = nombre;
  }
  void setApellido(string apellido) {
    this->apellido = apellido;
  }
  void setPlaca(string placa) {
    this->placa = placa;
  }
  void setKilometraje(string kilometraje) {
    this->kilometraje = kilometraje;
  }
  void setEmpresa(string empresa) {
    this->empresa = empresa;
  }
  string getNombre() {
    return this->nombre;
  }
  string getApellido() {
    return this->apellido;
  }
  string getPlaca() {
    return this->placa;
  }
  string getKilometraje() {
    return this->kilometraje;
  }
  string getEmpresa() {
    return this->empresa;
  }
  float getPrecio() {
    this->precio = stoi(kilometraje) * 1.5;
    return this->precio;
  }
};

class ListaMotorizados {
private:
  Motorizado** Lista;
  int n;
public:
  ListaMotorizados() : n(0), Lista(nullptr) {}
  ~ListaMotorizados(){}
  void agregarMotorizado(Motorizado* nuevo) {
    Motorizado** copia = new Motorizado * [n + 1];
    for (int i = 0; i < n; ++i) {
      copia[i] = Lista[i];
    }
    copia[n] = nuevo;
    if (Lista != nullptr) {
      delete[] Lista;
    }
    Lista = copia;
    ++n;
  }
  void eliminarMotorizado(int indice) {
    if (indice >= 0 && indice < n) {
      Motorizado** copia = new Motorizado * [n - 1];
      delete Lista[indice];
      for (int i = indice; i < n - 1; ++i) {
        Lista[i] = Lista[i + 1];
      }
      for (int i = 0; i < n - 1; ++i) {
        copia[i] = Lista[i];
      }
      delete[] Lista;
      --n;
      Lista = copia;
    }
  }
  void mostrarMotorizados() {
    cout << left << setw(12) << "Nombre:";
    cout << left << setw(12) << "Apellido:";
    cout << left << setw(12) << "Placa:";
    cout << left << setw(12) << "Kilometraje:";
    cout << left << setw(12) << "Precio:";
    cout << left << setw(12) << "Empresa:";
    cout << endl;
    for (int i = 0; i < n; ++i) {
      cout << left << setw(12) << Lista[i]->getNombre();
      cout << left << setw(12) << Lista[i]->getApellido();
      cout << left << setw(12) << Lista[i]->getPlaca();
      cout << left << setw(12) << Lista[i]->getKilometraje();
      cout << left << setw(12) << Lista[i]->getPrecio();
      cout << left << setw(12) << Lista[i]->getEmpresa();
      cout << endl;
    }
  }
  void mostrarMotorizados_Rappi() {
    cout << left << setw(12) << "Nombre:";
    cout << left << setw(12) << "Apellido:";
    cout << left << setw(12) << "Placa:";
    cout << left << setw(12) << "Kilometraje:";
    cout << left << setw(12) << "Precio:";
    cout << left << setw(12) << "Empresa:";
    cout << endl;
    for (int i = 0; i < n; ++i) {
      if (Lista[i]->getEmpresa() == "RAPPI") {
        cout << left << setw(12) << Lista[i]->getNombre();
        cout << left << setw(12) << Lista[i]->getApellido();
        cout << left << setw(12) << Lista[i]->getPlaca();
        cout << left << setw(12) << Lista[i]->getKilometraje();
        cout << left << setw(12) << Lista[i]->getPrecio();
        cout << left << setw(12) << Lista[i]->getEmpresa();
        cout << endl;
      }
    }
  }
  void mostrarMotorizados_Glopo() {
    cout << left << setw(12) << "Nombre:";
    cout << left << setw(12) << "Apellido:";
    cout << left << setw(12) << "Placa:";
    cout << left << setw(12) << "Kilometraje:";
    cout << left << setw(12) << "Precio:";
    cout << left << setw(12) << "Empresa:";
    cout << endl;
    for (int i = 0; i < n; ++i) {
      if (Lista[i]->getEmpresa() == "GLOPO") {
        cout << left << setw(12) << Lista[i]->getNombre();
        cout << left << setw(12) << Lista[i]->getApellido();
        cout << left << setw(12) << Lista[i]->getPlaca();
        cout << left << setw(12) << Lista[i]->getKilometraje();
        cout << left << setw(12) << Lista[i]->getPrecio();
        cout << left << setw(12) << Lista[i]->getEmpresa();
        cout << endl;
      }
    }
  }
  int getN() {
    return n;
  }
};

int main()
{
  // Variables auxiliares
  string nombre, apellido, placa, kilometraje, empresa;
  int opcion;
  // Objetos
  Motorizado* ObjMotorizado;
  ListaMotorizados* ObjLista = new ListaMotorizados;
  while (true) {
    system("cls");
    cout << ":::::::::::::::MENU::::::::::::::";
    cout << "\n1. Agregar motorizado";
    cout << "\n2. Eliminar motorizado";
    cout << "\n3. Mostrar todos los motorizados";
    cout << "\n4. Motorizados Rappi";
    cout << "\n5. Motorizados Glopo";
    cout << "\nSeleccione una opcion: ";
    cin >> opcion;
    switch (opcion) {
    case 1:
      cout << "Ingrese el nombre: ";
      cin >> nombre;
      cout << "Ingrese el apellido: ";
      cin >> apellido;
      cout << "Ingrese la placa: ";
      cin >> placa;
      cout << "Ingrese el kilometraje: ";
      cin >> kilometraje;
      cout << "Ingrese la empresa: ";
      cin >> empresa;
      ObjMotorizado = new Motorizado(nombre, apellido, placa, kilometraje, empresa);
      ObjLista->agregarMotorizado(ObjMotorizado);
      break;
    case 2:
      cout << "Ingrese el indice a eliminar (1 - " << ObjLista->getN() << ": ";
      cin >> opcion;
      ObjLista->eliminarMotorizado(opcion - 1);
      break;
    case 3:
      ObjLista->mostrarMotorizados();
      break;
    case 4:
      ObjLista->mostrarMotorizados_Rappi();
      break;
    case 5:
      ObjLista->mostrarMotorizados_Glopo();
      break;
    default:
      cout << "\nIngrese una opcion valida";
      break;
    }
    system("pause>0");
  }
  return 0;
}
