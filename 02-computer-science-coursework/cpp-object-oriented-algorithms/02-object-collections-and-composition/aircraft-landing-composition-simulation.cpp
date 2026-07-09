#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>

using namespace std;
using namespace System;
int randnum(int min, int max) {
    return min + rand() % (max - min + 1);
}
float randDX() {
    float dx = 0.1 + (float)rand() / RAND_MAX;
    int num = (randnum(1, 2) == 1) ? 1 : -1;
    dx *= num;
    return dx;
}
float randDY() {
    return (0.1 + (float)rand() / RAND_MAX) * 2;
}
void setColor(int textColor, int bgColor) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}

class Fuselaje {
private:
    char forma;
    float x, y;
public:
    Fuselaje(float x, float y, char forma) : x(x), y(y), forma(forma){}
    ~Fuselaje(){}
    void dibujar() {
        Console::SetCursorPosition(int(x), int(y)); cout << forma;
    }
    void borrar() {
        Console::SetCursorPosition(int(x), int(y)); cout << " ";
    }
    void setX(float x) {
        this->x = x;
    }
    void setY(float y) {
        this->y = y;
    }
};

class Alas {
private:
    float x, y;
public:
    Alas(float x, float y) : x(x), y(y){}
    ~Alas(){}
    void dibujar() {
        Console::SetCursorPosition(int(x - 2), int(y - 1)); cout << "__|__";
        Console::SetCursorPosition(int(x - 4), int(y));     cout << "---";
        Console::SetCursorPosition(int(x + 2), int(y)); cout << "---";
    }
    void borrar() {
        Console::SetCursorPosition(int(x - 2), int(y - 1)); cout << "     ";
        Console::SetCursorPosition(int(x - 4), int(y));     cout << "   ";
        Console::SetCursorPosition(int(x + 2), int(y)); cout << "   ";
    }
    void setX(float x) {
        this->x = x;
    }
    void setY(float y) {
        this->y = y;
    }
};

class TrenDeAterrizaje {
private:
    char forma;
    float x, y;
public:
    TrenDeAterrizaje(float x, float y, char forma): x(x), y(y), forma(forma){}
    ~TrenDeAterrizaje(){}
    void dibujar() {
        Console::SetCursorPosition(int(x - 1), int(y)); cout << forma;
        Console::SetCursorPosition(int(x + 1), int(y)); cout << forma;
    }
    void borrar() {
        Console::SetCursorPosition(int(x - 1), int(y)); cout << " ";
        Console::SetCursorPosition(int(x + 1), int(y)); cout << " ";
    }
    void setX(float x) {
        this->x = x;
    }
    void setY(float y) {
        this->y = y;
    }
};

class Avion {
private:
    float x, y;
    int limX1, limX2;
    float dx, dy;
    int color;
    Fuselaje* fuselaje;
    Alas* alas;
    TrenDeAterrizaje* tren;
public:
    Avion(float x, float y, int color) {
        this->x = x;
        this->y = y;
        this->limX1 = x + 3;
        this->limX2 = x - 3;
        this->dx = randDX();
        this->dy = randDY();
        this->color = color;
        fuselaje = new Fuselaje(x, y, 'O');
        alas = new Alas(x, y);
        tren = new TrenDeAterrizaje(x, y, 'o');
    }
    ~Avion() {
        delete fuselaje;
        delete alas;
        delete tren;
    }
    void dibujar() {
        setColor(color, 0);
        fuselaje->dibujar();
        alas->dibujar();
        tren->dibujar();
    }
    void mover() {
        if (x > limX1 || x < limX2) {
            this->dx *= -1;
        }
        x += dx;
        y += dy;
        fuselaje->setX(x);
        fuselaje->setY(y);
        alas->setX(x);
        alas->setY(y);
        tren->setX(x);
        tren->setY(y);

    }
    void borrar() {
        fuselaje->borrar();
        alas->borrar();
        tren->borrar();
    }
    float getY() {
        return this->y;
    }
    void setX(int x) {
        this->x = x;
        fuselaje->setX(x);
        alas->setX(x);
        tren->setX(x);
    }
    void setY(int y) {
        this->y = y;
        fuselaje->setY(y);
        alas->setY(y);
        tren->setY(y);
    }
    void setDX(float dx) {
        this->dx = dx;
    }
    void setDY(float dy) {
        this->dy = dy;
    }
};

class Aterrizaje {
private:
    Avion** aviones;
    int n;
public:
    Aterrizaje() {
        this->n = randnum(2, 5);
        aviones = new Avion * [n];
        for (int i = 0; i < n; ++i) {
            aviones[i] = new Avion((120/n) * (i+0.5), 5, randnum(1, 15));
        }
    }
    ~Aterrizaje() {
        for (int i = 0; i < n; ++i) {
            delete aviones[i];
        }
        delete[] aviones;
    }
    void iniciarAterrizaje() {
        cout << "Presiona G para empezar el aterrizaje";
        for (int i = 0; i < n; ++i) {
            aviones[i]->dibujar();
        }
        while (true) {
            bool ready = false;
            if (_kbhit()) {
                char input = toupper(_getch());
                if (input == 'G') {
                    ready = true;
                    system("cls");
                }
            }
            while (ready) {
                bool end = false;
                for (int i = 0; i < n; ++i) {
                    aviones[i]->borrar();
                    aviones[i]->mover();
                    aviones[i]->dibujar();
                    if (aviones[i]->getY() >= 25) {
                        aviones[i]->borrar();
                        aviones[i]->setY(25);
                        aviones[i]->dibujar();
                        aviones[i]->setDX(0);
                        aviones[i]->setDY(0);
                    }
                }
                for (int i = 0; i < n; ++i) {
                    if (aviones[i]->getY() >= 25) {
                        end = true;
                    }
                    else {
                        end = false;
                        break;
                    }
                }
                if (end) {
                    setColor(7, 0);
                    system("cls");
                    cout << "El aterrizaje ha finalizado";
                    setColor(0, 0);
                    exit(0);
                }
                Sleep(150);
            }
        }
    }
};

int main() {
    srand(time(0));
    Console::CursorVisible = false;
    Aterrizaje* ObjAterrizaje = new Aterrizaje;
    ObjAterrizaje->iniciarAterrizaje();
    return 0;
}
