#include "pch.h"
#include <iostream>
#include <conio.h>

using namespace std;
using namespace System;
float randDX() {
	return 0.1 + (float)rand() / RAND_MAX;
}
// Hiperclase
class Vehiculo {
protected:
	float x, y;
	float dx;
public:
	Vehiculo(float x, float y, float dx) : x(x), y(y), dx(dx){}
	~Vehiculo(){}
	virtual void borrar() = 0;
	virtual void mover() = 0;
	virtual void dibujar() = 0;
};
// Superclases
class Maritimo : public Vehiculo {
public:
	Maritimo(float x, float y, float dx) : Vehiculo(x, y, dx){}
	~Maritimo(){}
};
class Terrestre : public Vehiculo {
public:
	Terrestre(float x, float y, float dx) : Vehiculo(x, y, dx) {}
	~Terrestre() {}
};
class Aereo : public Vehiculo {
public:
	Aereo(float x, float y, float dx) : Vehiculo(x, y, dx) {}
	~Aereo() {}
};
// Subclases
class Barco : public Maritimo {
public:
	Barco(float x, float y, float dx) : Maritimo(x, y, dx){}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "                                ";
		Console::SetCursorPosition(int(x), y + 1); cout << "                                ";
		Console::SetCursorPosition(int(x), y + 2); cout << "                                ";
		Console::SetCursorPosition(int(x), y + 3); cout << "                                ";
		Console::SetCursorPosition(int(x), y + 4); cout << "                                ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);   cout << "                __/___            ";
		Console::SetCursorPosition(int(x), y+1); cout << "          _____/______|           ";
		Console::SetCursorPosition(int(x), y+2); cout << "  _______/_____\_______\_____     ";
		Console::SetCursorPosition(int(x), y+3); cout << "  \              < < <       |    ";
		Console::SetCursorPosition(int(x), y+4); cout << "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
class Bote : public Maritimo {
public:
	Bote(float x, float y, float dx) : Maritimo(x, y, dx) {}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "                       ";
		Console::SetCursorPosition(int(x), y + 1); cout << "                       ";
		Console::SetCursorPosition(int(x), y + 2); cout << "                       ";
		Console::SetCursorPosition(int(x), y + 3); cout << "                       ";
		Console::SetCursorPosition(int(x), y + 4); cout << "                       ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);     cout << "        _    _";
		Console::SetCursorPosition(int(x), y + 1); cout << "     __|_|__|_|__";
		Console::SetCursorPosition(int(x), y + 2); cout << "   _|____________|__";
		Console::SetCursorPosition(int(x), y + 3); cout << "  |o o o o o o o o /";
		Console::SetCursorPosition(int(x), y + 4); cout << "~'`~'`~'`~'`~'`~'`~'`~";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
class Carro : public Terrestre {
public:
	Carro(float x, float y, float dx) : Terrestre(x, y, dx) {}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "              ";
		Console::SetCursorPosition(int(x), y + 1); cout << "              ";
		Console::SetCursorPosition(int(x), y + 2); cout << "              ";
		Console::SetCursorPosition(int(x), y + 3); cout << "              ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);     cout << "  ______";
		Console::SetCursorPosition(int(x), y + 1); cout << " /|_||_\`.__";
		Console::SetCursorPosition(int(x), y + 2); cout << "(   _    _ _\\";
		Console::SetCursorPosition(int(x), y + 3); cout << "=`-(_)--(_)-'";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
class Camion : public Terrestre {
public:
	Camion(float x, float y, float dx) : Terrestre(x, y, dx) {}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "                              ";
		Console::SetCursorPosition(int(x), y + 1); cout << "                              ";
		Console::SetCursorPosition(int(x), y + 2); cout << "                              ";
		Console::SetCursorPosition(int(x), y + 3); cout << "                              ";
		Console::SetCursorPosition(int(x), y + 4); cout << "                              ";
		Console::SetCursorPosition(int(x), y + 5); cout << "                              ";
		Console::SetCursorPosition(int(x), y + 6); cout << "                              ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);     cout << " ================\\";
		Console::SetCursorPosition(int(x), y + 1); cout << " |----------||@  \\\\   ___";
		Console::SetCursorPosition(int(x), y + 2); cout << " |____|_____|||_/_\\\\_|___|_";
		Console::SetCursorPosition(int(x), y + 3); cout << "<|  ___\\    ||     | ____  |";
		Console::SetCursorPosition(int(x), y + 4); cout << "<| /    |___||_____|/    | |";
		Console::SetCursorPosition(int(x), y + 5); cout << "||/  O  |__________/  O  |_||";
		Console::SetCursorPosition(int(x), y + 6); cout << "   \\___/            \\___/";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
class Avion : public Aereo {
public:
	Avion(float x, float y, float dx) : Aereo(x, y, dx) {}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "                 ";
		Console::SetCursorPosition(int(x), y + 1); cout << "                 ";
		Console::SetCursorPosition(int(x), y + 2); cout << "                 ";
		Console::SetCursorPosition(int(x), y + 3); cout << "                 ";
		Console::SetCursorPosition(int(x), y + 4); cout << "                 ";
		Console::SetCursorPosition(int(x), y + 5); cout << "                 ";
		Console::SetCursorPosition(int(x), y + 6); cout << "                 ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);     cout << "        _";
		Console::SetCursorPosition(int(x), y + 1); cout << "      -=\\`\\";
		Console::SetCursorPosition(int(x), y + 2); cout << "  |\\ ____\\_\\__";
		Console::SetCursorPosition(int(x), y + 3); cout << "-=\\c`'''''''''`)";
		Console::SetCursorPosition(int(x), y + 4); cout << "   `~~~~~/ /~~`";
		Console::SetCursorPosition(int(x), y + 5); cout << "     -==/ /";
		Console::SetCursorPosition(int(x), y + 6); cout << "       '-'";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
class Helicoptero : public Aereo {
public:
	Helicoptero(float x, float y, float dx) : Aereo(x, y, dx) {}
	void borrar() override {
		Console::SetCursorPosition(int(x), y);     cout << "                  ";
		Console::SetCursorPosition(int(x), y + 1); cout << "                  ";
		Console::SetCursorPosition(int(x), y + 2); cout << "                  ";
		Console::SetCursorPosition(int(x), y + 3); cout << "                  ";
		Console::SetCursorPosition(int(x), y + 4); cout << "                  ";
		Console::SetCursorPosition(int(x), y + 5); cout << "                  ";
	}
	void mover() override {
		x += dx;
	}
	void dibujar() override {
		Console::SetCursorPosition(int(x), y);     cout << " __";
		Console::SetCursorPosition(int(x), y + 1); cout << " \\  \\     _ _";
		Console::SetCursorPosition(int(x), y + 2); cout << "  \\**\\ ___\\/ \\";
		Console::SetCursorPosition(int(x), y + 3); cout << "X*#####*+^^\\_\\";
		Console::SetCursorPosition(int(x), y + 4); cout << "  o/\\  \\";
		Console::SetCursorPosition(int(x), y + 5); cout << "     \\__\\";

	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
};
// Clase Compiladora
class Carrera {
private:
	Barco* ObjBarco;
	Bote* ObjBote;
	Carro* ObjCarro;
	Camion* ObjCamion;
	Avion* ObjAvion;
	Helicoptero* ObjHelicoptero;
public:
	Carrera() {
		ObjBote = new Bote(4, 7, randDX());
		ObjBarco = new Barco(4, 12, randDX());
		ObjCarro = new Carro(4, 5, randDX());
		ObjCamion = new Camion(4, 10, randDX());
		ObjAvion = new Avion(4, 5, randDX());
		ObjHelicoptero = new Helicoptero(4, 15, randDX());
	}
	void iniciarCarrera() {
		Console::CursorVisible = false;
		int input;
		while (true) {
			system("cls");
			cout << "1. Modelar marinos";
			cout << "\n2. Modelar terrestres";
			cout << "\n3. Modelar aereos";
			cout << "\n4. Salir";
			input = _getch() - '0';
			switch (input) {
			case 1:
				while (ObjBarco->getX() < 40) {
					ObjBote->borrar();
					ObjBote->mover();
					ObjBote->dibujar();
					ObjBarco->borrar();
					ObjBarco->mover();
					ObjBarco->dibujar();
					_sleep(500);
				}
				break;
			case 2:
				while (ObjCarro->getX() < 40 && ObjCamion->getX() < 40) {
					ObjCarro->borrar();
					ObjCarro->mover();
					ObjCarro->dibujar();
					ObjCamion->borrar();
					ObjCamion->mover();
					ObjCamion->dibujar();
					_sleep(500);
				}
				break;
			case 3:
				while (ObjAvion->getX() < 40 && ObjHelicoptero->getX() < 40) {
					ObjAvion->borrar();
					ObjAvion->mover();
					ObjAvion->dibujar();
					ObjHelicoptero->borrar();
					ObjHelicoptero->mover();
					ObjHelicoptero->dibujar();
					_sleep(500);
				}
				break;
			case 4:
				cout << "\nSaliendo...";
				exit(0);
			}
			system("pause>0");
		}
	}
};

int main() {
	srand(time(0));
	Carrera* ObjCarrera = new Carrera;
	ObjCarrera->iniciarCarrera();
	return 0;
}
