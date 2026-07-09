#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>
#include <iomanip>

using  namespace std;
using namespace System;

void setColor(int textColor, int bgColor) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}
void resetColor() {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, 7);
}
int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}
int randX() {
	return randnum(50, 110);
}
int randY() {
	return randnum(25, 26);
}

class Personaje {
protected:
	int x, y;
	int dx, dy;
	int color;
public:
	Personaje(int x, int y, int dx, int dy, int color) : x(x), y(y), dx(dx), dy(dy), color(color) {}
	~Personaje() {}
	virtual void dibujar() = 0;
	virtual void borrar() = 0;
	virtual void mover(char input = 0) = 0;
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Caballero : public Personaje {
private:
	int vidas;
public:
	Caballero(int x, int y, int dx, int dy, int color, int vidas) : Personaje(x, y, dx, dy, color) {
		this->vidas = vidas;
	}
	~Caballero() {}
	void dibujar() override {
		// 3
		setColor(color, 0);
		Console::SetCursorPosition(x, y);		cout << " O";
		Console::SetCursorPosition(x, y + 1);	cout << "/|\\";
		Console::SetCursorPosition(x, y + 2);	cout << "/ \\";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);		cout << "   ";
		Console::SetCursorPosition(x, y + 1);	cout << "   ";
		Console::SetCursorPosition(x, y + 2);	cout << "   ";
	}
	void mover(char input) override {
		if (input == 'W') y -= dy;
		else if (input == 'A') x -= dx;
		else if (input == 'S') y += dy;
		else if (input == 'D') x += dx;

		if (x < 1) x = 1;
		else if (x > 110) x = 110;
		else if (y < 1) y = 1;
		else if (y > 26) y = 26;
	}
	int getVidas() {
		return this->vidas;
	}
	void setVidas(int vidas) {
		this->vidas = vidas;
	}
};

class Enemigo : public Personaje {
public:
	Enemigo(int x, int y, int dx, int dy, int color) : Personaje(x, y, dx, dy, color) {}
	~Enemigo() {}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);		cout << " @";
		Console::SetCursorPosition(x, y + 1);	cout << "/|\\";
		Console::SetCursorPosition(x, y + 2);	cout << "/ \\";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);		cout << "   ";
		Console::SetCursorPosition(x, y + 1);	cout << "   ";
		Console::SetCursorPosition(x, y + 2);	cout << "   ";
	}
	void mover(char input) override {}
	void mover() {
		if (x > 1 && y > 1) x -= dx, y -= dy;
		else if (x <= 1 && y > 1) y -= dy;
		else if (x > 1 && y <= 1) x -= dx;
	}
};
class Castillo {
private:
	int x, y;
	int color;
public:
	Castillo(int x, int y, int color) : x(x), y(y), color(color) {}
	~Castillo() {}
	void dibujar() {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);		cout << "  |||||";
		Console::SetCursorPosition(x, y + 1);	cout << "  |||||";
		Console::SetCursorPosition(x, y + 2);	cout << " |||||||";
		Console::SetCursorPosition(x, y + 3);	cout << "=========";
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Bala {
private:
	char forma;
	int x, y;
	int dx, dy;
	int opcion;
public:
	Bala(int x, int y, int dx, int dy, char forma, int opcion) : x(x), y(y), dx(dx), dy(dy), forma(forma), opcion(opcion) {}
	~Bala() {}
	void dibujar() {
		Console::SetCursorPosition(x, y); cout << forma;
	}
	void borrar() {
		Console::SetCursorPosition(x, y); cout << " ";
	}
	void mover() {
		if (opcion == 1) {
			y -= dy;
		}
		else if (opcion == 2) {
			x -= dx;
		}
		else if (opcion == 3) {
			y += dy;
		}
		else if (opcion == 4) {
			x += dx;
		}
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Arco {
private:
	int x, y;
	int dx, dy;
	Bala** balas;
	int n;
public:
	Arco(int x, int y, int dx, int dy) : x(x), y(y), dx(dx), dy(dy) {
		balas = nullptr;
		n = 0;
	}
	~Arco() {}
	void dibujar() {
		Console::SetCursorPosition(x + 3, y + 1);
		cout << "->";
	}
	void borrar() {
		Console::SetCursorPosition(x + 3, y + 1);
		cout << "  ";
	}
	void eliminarBala(int indice) {
		delete balas[indice];
		Bala** copia = new Bala * [n - 1];
		for (int i = indice; i < n - 1; ++i) {
			balas[i] = balas[i + 1];
		}
		for (int i = 0; i < n - 1; ++i) {
			copia[i] = balas[i];
		}
		delete[] balas;
		balas = copia;
		--n;
	}
	void actualizarBalas(char input, int x, int y) {
		if (input == 'P') {
			Bala** copia = new Bala * [n + 1];
			for (int i = 0; i < n; ++i) {
				copia[i] = balas[i];
			}
			copia[n] = new Bala(x, y, 2, 2, '*', randnum(1, 4));
			balas = copia;
			++n;
		}
	}
	void moverBalas() {
		for (int i = 0; i < n; ++i) {
			balas[i]->borrar();
			balas[i]->mover();
			balas[i]->dibujar();
			if (balas[i]->getX() > 110 || balas[i]->getX() < 3 || balas[i]->getY() > 26 || balas[i]->getY() < 2) {
				balas[i]->borrar();
				eliminarBala(i);
				--i;
			}
		}
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
	Bala** getBalas() {
		return this->balas;
	}
	int getN_Balas() {
		return this->n;
	}
};

class Juego {
private:
	Caballero* caballero;
	Enemigo** enemigos;
	int n_Enemigos;
	Castillo* castillo;
	Arco* arco;
public:
	Juego() {
		caballero = new Caballero(60, 13, 2, 2, 3, 3);
		n_Enemigos = 5;
		enemigos = new Enemigo * [n_Enemigos];
		for (int i = 0; i < n_Enemigos; ++i) {
			enemigos[i] = new Enemigo(randX(), randY(), 1, 1, 4);
		}
		castillo = new Castillo(0, 0, 8);
		arco = new Arco(caballero->getX(), caballero->getY(), 2, 2);
	}
	~Juego() {
		delete caballero;
		for (int i = 0; i < n_Enemigos; ++i) {
			delete enemigos[i];
		}
		delete[] enemigos;
		delete castillo;
		delete arco;
	}
	void eliminarEnemigo(int indice) {
		delete enemigos[indice];
		Enemigo** copia = new Enemigo * [n_Enemigos - 1];
		for (int i = 0; i < n_Enemigos - 1; ++i) {
			if (i < indice) {
				copia[i] = enemigos[i];
			}
			else {
				copia[i] = enemigos[i + 1];
			}
		}
		delete[] enemigos;
		enemigos = copia;
		--n_Enemigos;
	}
	void moverEnemigos() {
		for (int i = 0; i < n_Enemigos; ++i) {
			enemigos[i]->borrar();
			enemigos[i]->mover();
			enemigos[i]->dibujar();
		}
	}
	void colision_Castillo() {
		for (int i = n_Enemigos - 1; i >= 0; --i) {
			if (enemigos[i]->getX() <= 8 && enemigos[i]->getY() <= 3) {
				caballero->setVidas(caballero->getVidas() - 1);
				enemigos[i]->borrar();
				eliminarEnemigo(i);
			}
		}
	}
	void colision_Flechas() {
		for (int i = 0; i < arco->getN_Balas(); ++i) {
			for (int j = n_Enemigos - 1; j >= 0; --j) {
				if (arco->getBalas()[i]->getX() >= enemigos[j]->getX() &&
					arco->getBalas()[i]->getX() <= enemigos[j]->getX() + 2 &&
					arco->getBalas()[i]->getY() >= enemigos[j]->getY() &&
					arco->getBalas()[i]->getY() <= enemigos[j]->getY() + 2)
				{
					arco->getBalas()[i]->borrar();
					arco->eliminarBala(i);
					enemigos[j]->borrar();
					eliminarEnemigo(j);
					--i;
					break;
				}
			}
		}
	}
	void victoria() {
		bool end = false;
		if (n_Enemigos <= 0 || caballero->getVidas() <= 0) {
			end = true;
		}
		if (end) {
			setColor(15, 0);
			if (n_Enemigos <= 0) {
				system("cls");
				cout << "HAS GANADO";
			}
			else if (caballero->getVidas() <= 0) {
				system("cls");
				cout << "HAS PERDIDO";
			}
			cout << "\nCreditos a JEAN FRANCK LOA ROJAS";
			_sleep(500);
			setColor(0, 0);
			exit(0);
		}
	}
	void iniciarJuego() {
		while (true) {
			castillo->dibujar();
			caballero->borrar();
			arco->borrar();
			if (_kbhit()) {
				char input = toupper(_getch());
				caballero->mover(input);
				arco->actualizarBalas(input, caballero->getX() + 3, caballero->getY() + 1);
			}
			arco->setX(caballero->getX());
			arco->setY(caballero->getY());
			arco->moverBalas();
			arco->dibujar();
			caballero->dibujar();
			moverEnemigos();
			colision_Castillo();
			colision_Flechas();
			victoria();
			mostrarVidas();
			Sleep(100);
		}
	}
	void mostrarVidas() {
		Console::SetCursorPosition(0, 29); cout << "Vidas: " << setw(1) << caballero->getVidas();
	}
};

int main() {
	Console::CursorVisible = false;
	srand(time(0));
	Juego* ObjJuego = new Juego;
	ObjJuego->iniciarJuego();

	return 0;
}
