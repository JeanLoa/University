#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>
#include <iomanip>

using namespace std;
using namespace System;

int randnum(int min, int max) {
    return min + rand() % (max - min + 1);
}

int randdir() {
    int num = randnum(1, 2);
    if (num == 1) {
        return 1;
    }
    else {
        return -1;
    }
}

void setColor(int color) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    SetConsoleTextAttribute(hConsole, color);
}

class Bala {
private:
    int x, y;
    int dx, dy;
    int color;
    int opcion = randnum(1, 2);
public:
    Bala(int x, int y, int dx, int dy, int color): x(x), y(y), dx(dx), dy(dy), color(color){}
    ~Bala(){}
    void mover() {
        switch (opcion) {
        case 1:
            if (x >= 0 && x <= 119 && y >= 1 && y <= 15) {
                if (x == 0) {
                    dx *= -1;
                }
                else if (x == 119) {
                    dx *= -1;
                }
                else if (y == 1) {
                    dy *= -1;
                }
                else if (y == 15) {
                    dy *= -1;
                }
                x += dx, y += dy;
            }
            break;
        case 2:
            if (x >= 0 && x <= 119 && y >= 16 && y <= 28) {
                if (x == 119 && y == 28) {
                    dx *= -1, dy *= -1;
                }
                else if (x == 0) {
                    dx *= -1;
                }
                else if (x == 119) {
                    dx *= -1;
                }
                else if (y == 16) {
                    dy *= -1;
                }
                else if (y == 28) {
                    dy *= -1;
                }
                x += dx;
                y += dy;
            }
            break;
        }
    }
    void borrar() {
        Console::SetCursorPosition(x, y);
        cout << ' ';
    }
    void dibujar() {
        asignarColor();
        Console::SetCursorPosition(x, y);
        cout << '*';
    }
    void asignarColor() {
        if (opcion == 1) {
            setColor(color);
        }
        else if (opcion == 2) {
            setColor(color);
        }
    }
};

class Disparador {
private:
    Bala** balas;
    int n;
    int x, y;
    char forma;
    int color;
public:
    Disparador(int x, int y, char forma, int color) : balas(nullptr), n(0), x(x), y(y), forma(forma), color(color){}
    ~Disparador() { delete[] balas; }
    void agregarBala(Bala* nuevo) {
        Bala** copia = new Bala * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = balas[i];
        }
        copia[n] = nuevo;
        delete[] balas;
        balas = copia;
        ++n;
    }
    void eliminarBala() {
        if (n > 0) {
            Bala** copia = new Bala * [n - 1];
            balas[n - 1]->borrar();
            delete balas[n - 1];
            for (int i = 0; i < n - 1; ++i) {
                copia[i] = balas[i];
            }
            delete[] balas;
            balas = copia;
            --n;
        }
    }
    void moverBalas() {
        for (int i = 0; i < n; ++i) {
            balas[i]->borrar();
            balas[i]->mover();
            balas[i]->dibujar();
        }
    }
    void dibujarDisparador() {
        asignarColor();
        Console::SetCursorPosition(x, y);
        cout << forma;
    }
    void asignarColor() {
        setColor(color);
    }
    void mostrarBalas(int x, int y) {
        Console::SetCursorPosition(x, y);
        setColor(color);
        cout << "Balas: " << getN();
    }
    int getN() {
        return n;
    }
};

int main() {
    srand(time(0));
    Bala* ObjBala;
    Disparador* ObjDisparador1 = new Disparador(60, 15, 219, 4);
    Disparador* ObjDisparador2 = new Disparador(60, 16, 219, 1);
    int dx, dy;
    while (true) {
        dx = randdir();
        ObjDisparador1->mostrarBalas(0, 0);
        ObjDisparador2->mostrarBalas(0, 29);
        ObjDisparador1->dibujarDisparador();
        ObjDisparador2->dibujarDisparador();
        ObjDisparador1->moverBalas();
        ObjDisparador2->moverBalas();
        if (_kbhit()) {
            char input = toupper(_getch());
            if (input == 'R') {
                ObjBala = new Bala(60, 14, dx, 1, 4);
                ObjDisparador1->agregarBala(ObjBala);
            }
            else if (input == 'X') {
                ObjDisparador1->eliminarBala();
            }
            if (input == 'A') {
                ObjBala = new Bala(60, 17, dx, 1, 1);
                ObjDisparador2->agregarBala(ObjBala);
            }
            else if (input == 'E') {
                ObjDisparador2->eliminarBala();
            }
        }
        Sleep(50);
    }
    return 0;
}
