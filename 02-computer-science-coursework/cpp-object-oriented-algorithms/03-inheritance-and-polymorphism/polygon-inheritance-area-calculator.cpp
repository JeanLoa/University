#include "pch.h"
#include <iostream>

using namespace System;
using namespace std;

class Poligono {
protected:
	double* lados;
	int n_Lados;
public:
	Poligono(int n_Lados) : lados(new double[n_Lados]), n_Lados(n_Lados){}
	virtual ~Poligono() { delete[] lados; }
	virtual double Perimetro() = 0;
	virtual double Area() = 0;
};

class Triangulo : public Poligono {
private:
	double base;
	double altura;
public:
	Triangulo(double l1, double l2, double l3, double base, double altura, int n_Lados) : Poligono(n_Lados), altura(altura), base(base) {
		lados[0] = l1;
		lados[1] = l2;
		lados[2] = l3;
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = base * altura / 2;
		return area;
	}
};

class Cuadrado : public Poligono {
public:
	Cuadrado(double l, int n_Lados) : Poligono(n_Lados) {
		for (int i = 0; i < n_Lados; ++i) {
			this->lados[i] = l;
		}
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = pow(lados[0], 2);
		return area;
	}
};

class Rectangulo : public Poligono {
private:
	double base;
	double altura;
public:
	Rectangulo(double base, double altura, int n_Lados) : Poligono(n_Lados), base(base), altura(altura) {
		lados[0] = base;
		lados[1] = base;
		lados[2] = altura;
		lados[3] = altura;
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = altura * base;
		return area;
	}
};

class Rombo : public Poligono {
private:
	double d;
	double D;
public:
	Rombo(double l, double d, double D, int n_Lados) : Poligono(n_Lados), d(d), D(D) {
		lados[0] = l;
		lados[1] = l;
		lados[2] = l;
		lados[3] = l;
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = D * d;
		return area;
	}
};

class Romboide : public Poligono {
private:
	double base;
	double altura;
public:
	Romboide(double l1, double l2, double altura, double base, int n_Lados) : Poligono(n_Lados), altura(altura), base(base) {
		lados[0] = l1;
		lados[1] = l1;
		lados[2] = l2;
		lados[3] = l2;
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = base * altura / 2;
		return area;
	}
};

class Trapecio : public Poligono {
private:
	double altura;
	double b;
	double B;
public:
	Trapecio(double l1, double l2, double l3, double l4, double altura, double b, double B, int n_Lados) : Poligono(n_Lados), altura(altura), b(b), B(B) {
		lados[0] = l1;
		lados[1] = l2;
		lados[2] = l3;
		lados[3] = l4;
	}
	double Perimetro() override {
		double perimetro = 0;
		for (int i = 0; i < n_Lados; ++i) {
			perimetro += lados[i];
		}
		return perimetro;
	}
	double Area() override {
		double area = 0;
		area = altura * (b + B) / 2;
		return area;
	}
};

int main() {
	srand(time(nullptr));
	Console::CursorVisible = false;
	// Variables auxiliares
	int input;
	bool Salir;
/* 
Objetos
*/
	Triangulo* triangulo = nullptr;
	Cuadrado* cuadrado = nullptr;
	Rectangulo* rectangulo = nullptr;
	Rombo* rombo = nullptr;
	Romboide* romboide = nullptr;
	Trapecio* trapecio = nullptr;
/*
Datos para construir
*/
	int l1, l2, l3, l4;
	double base, altura;
	double base_menor, base_mayor;
	double diagonal_menor, diagonal_mayor;
	while (true) {
		system("cls");
		cout << "1. Construir triangulo";
		cout << "\n2. Construir cuadrado";
		cout << "\n3. Construir rectangulo";
		cout << "\n4. Construir rombo";
		cout << "\n5. Construir romboide";
		cout << "\n6. Construir trapecio";
		cout << "\n7. Ver perimetros";
		cout << "\n8. Ver areas";
		cout << "\n9. Salir";
		cout << "\nElige una opcion: ";
		cin >> input;
		switch (input) {
		case 1:
			cout << "Ingrese el lado 1: ";
			cin >> l1;
			cout << "Ingrese el lado 2: ";
			cin >> l2;
			cout << "Ingrese el lado 3: ";
			cin >> l3;
			cout << "Ingrese la altura: ";
			cin >> altura;
			cout << "Ingrese la base: ";
			cin >> base;
			triangulo = new Triangulo(l1, l2, l3, altura, base, 3);
			break;
		case 2:
			cout << "Ingrese el lado: ";
			cin >> l1;
			cuadrado = new Cuadrado(l1, 4);
			break;
		case 3:
			cout << "Ingrese la base: ";
			cin >> base;
			cout << "Ingrese la altura: ";
			cin >> altura;
			rectangulo = new Rectangulo(base, altura, 4);
			break;
		case 4:
			cout << "Ingrese el lado: ";
			cin >> l1;
			cout << "Ingrese la diagonal menor: ";
			cin >> diagonal_menor;
			cout << "Ingresse la diagonal mayor: ";
			cin >> diagonal_mayor;
			rombo = new Rombo(l1, diagonal_menor, diagonal_mayor, 4);
			break;
		case 5:
			cout << "Ingrese el lado 1: ";
			cin >> l1;
			cout << "Ingrese el lado 2: ";
			cin >> l2;
			cout << "Ingrese la base: ";
			cin >> base;
			cout << "Ingrese el altura: ";
			cin >> altura;
			romboide = new Romboide(l1, l2, base, altura, 4);
			break;
		case 6:
			cout << "Ingrese el lado 1: ";
			cin >> l1;
			cout << "Ingrese el lado 2: ";
			cin >> l2;
			cout << "Ingrese el lado 3: ";
			cin >> l3;
			cout << "Ingrese el lado 4: ";
			cin >> l4;
			cout << "Ingrese el altura: ";
			cin >> altura;
			cout << "Ingrese la base menor: ";
			cin >> base_menor;
			cout << "Ingrese la base mayor: ";
			cin >> base_mayor;
			trapecio = new Trapecio(l1, l2, l3, l4, altura, base_menor, base_mayor, 4);
			break;
		case 7:
			do {
				system("cls");
				Salir = false;
				cout << "1. Mostrar perimetro del triangulo";
				cout << "\n2. Mostrar perimetro del cuadrado";
				cout << "\n3. Mostrar perimetro del rectangulo";
				cout << "\n4. Mostrar perimetro del rombo";
				cout << "\n5. Mostrar perimetro del romboide";
				cout << "\n6. Mostrar perimetro del trapecio";
				cout << "\n7. Salir";
				cout << "\nElige una opcion: ";
				cin >> input;
				cout << endl;
				switch (input) {
				case 1:
					if (triangulo != nullptr) {
						cout << "El perimetro del triagulo es: " << triangulo->Perimetro();
					}
					else {
						cout << "El triangulo no ha sido inicializado";
					}
					break;
				case 2:
					if (cuadrado != nullptr) {
						cout << "El perimetro del cuadrado es: " << cuadrado->Perimetro();
					}
					else {
						cout << "El cuadrado no ha sido inicializado";
					}
					break;
				case 3:
					if (rectangulo != nullptr) {
						cout << "El perimetro del rectangulo es: " << rectangulo->Perimetro();
					}
					else {
						cout << "El rectangulo no ha sido inicializado";
					}
					break;
				case 4:
					if (rombo != nullptr) {
						cout << "El perimetro del rombo es: " << rombo->Perimetro();
					}
					else {
						cout << "El rombo no ha sido inicializado";
					}
					break;
				case 5:
					if (romboide != nullptr) {
						cout << "El perimetro del romboide es: " << romboide->Perimetro();
					}
					else {
						cout << "El romboide no ha sido inicializado";
					}
					break;
				case 6:
					if (trapecio != nullptr) {
						cout << "El perimetro del trapecio es: " << trapecio->Perimetro();
					}
					else {
						cout << "El trapecio no ha sido inicializado";
					}
					break;
				case 7:
					cout << "Saliendo...";
					Salir = true;
					break;
				}
				system("pause>0");
			} while (!Salir);
			break;
		case 8:
			do {
				system("cls");
				Salir = false;
				cout << "1. Mostrar area del triangulo";
				cout << "\n2. Mostrar area del cuadrado";
				cout << "\n3. Mostrar area del rectangulo";
				cout << "\n4. Mostrar area del rombo";
				cout << "\n5. Mostrar area del romboide";
				cout << "\n6. Mostrar area del trapecio";
				cout << "\n7. Salir";
				cout << "\nElige una opcion: ";
				cin >> input;
				cout << endl;
				switch (input) {
				case 1:
					if (triangulo != nullptr) {
						cout << "El area del triagulo es: " << triangulo->Area();
					}
					else {
						cout << "El triangulo no ha sido inicializado";
					}
					break;
				case 2:
					if (cuadrado != nullptr) {
						cout << "El area del cuadrado es: " << cuadrado->Area();
					}
					else {
						cout << "El cuadrado no ha sido inicializado";
					}
					break;
				case 3:
					if (rectangulo != nullptr) {
						cout << "El area del rectangulo es: " << rectangulo->Area();
					}
					else {
						cout << "El rectangulo no ha sido inicializado";
					}
					break;
				case 4:
					if (rombo != nullptr) {
						cout << "El area del rombo es: " << rombo->Area();
					}
					else {
						cout << "El rombo no ha sido inicializado";
					}
					break;
				case 5:
					if (romboide != nullptr) {
						cout << "El area del romboide es: " << romboide->Area();
					}
					else {
						cout << "El rombiode no ha sido inicializado";
					}
					break;
				case 6:
					if (trapecio != nullptr) {
						cout << "El area del trapecio es: " << trapecio->Area();
					}
					else {
						cout << "El trapecio no ha sido inicializado";
					}
					break;
				case 7:
					cout << "Saliendo...";
					Salir = true;
					break;
				}
				system("pause>0");
			} while (!Salir);
			break;
		case 9:
			cout << "Saliendo del programa...";
			return 0;
		default:
			cout << "Ingrese una opcion valida";
			break;
		}
		system("pause>0");
	}
}
