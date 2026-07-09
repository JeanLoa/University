#include <iostream> // Necesario para operadores de entrada y salida de datos
#include <conio.h> // Necesario para getch()
#include <cstdlib> // Necesario para system("cls")
#include <ctime> // Necesario para srand y rand
#include <windows.h> // Necesario para HideCursor y SetColor
#include <string> // Para usar string

using namespace std; // Alias std

const int width = 60; // Ancho del tablero
const int height = 25; // Alto del tablero
int posX = width / 2; // Posición inicial X del muñeco O
int posY = height / 2; // Posición inicial Y del muñeco O
const int numCharacters = 10; // Número total de muñecos

bool validPosition; // Booleano para controlar la validacion de posicion

int TutorVisits; // Visitas al tutor
int EnemyVisits; // Visitas al enemigo
float Points = 99; // Puntaje del jugador

string Espera = "Presiona cualquier tecla para continuar..."; // Tiempo de espera
string Despedida = "El juego ha finalizado";                  // Mensaje de Despedida

char board[height][width]; // Tablero de juego

/*
Mundos
*/
char Board_1[height][width] = {
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
};

char Board_2[height][width] = {
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1},
    {1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1},
    {1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1},
    {1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
};

char Board_3[height][width] = {
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1},
    {1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1},
    {1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1},
    {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
};

/*
Impresion de Mundos
*/
void PrintBoard_1(char board[height][width]) {
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            if (board[i][j] == 1) {
                cout << "# "; // Bloque de color rojo
            }
            else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void PrintBoard_2(char board[height][width]) {
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            if (board[i][j] == 1) {
                cout << "# "; // Bloque de color verde
            }
            else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void PrintBoard_3(char board[height][width]) {
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            if (board[i][j] == 1) {
                cout << "# "; // Bloque de color amarillo
            }
            else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

/*
Funciones Auxiliares
*/
void setColor(int textColor, int bgColor) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}

void resetColor() {
    setColor(7, 0);
}

void gotoxy(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void clearScreen() {
    system("cls");
}

void hideCursor() {
    // Estructura para almacenar la información del cursor
    CONSOLE_CURSOR_INFO cursorInfo;

    // Manejador de la consola
    HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);

    // Obtiene la información actual del cursor
    GetConsoleCursorInfo(consoleHandle, &cursorInfo);

    // Oculta el cursor estableciendo su visibilidad en false
    cursorInfo.bVisible = false;

    // Establece la información del cursor en la consola
    SetConsoleCursorInfo(consoleHandle, &cursorInfo);
}

int randnum(int min, int max) {
    return min + rand() % (max - min + 1);
}

/*
Heroe
*/
void PuntajeHeroe(int x, int y, int points) {
    gotoxy(x, y);
    cout << "Puntaje del Jugador: " << points;
    gotoxy(0, 0);
}

void Hero(int level, int x, int y, string name) {
    gotoxy(x, y);
    cout << "Has llegado al Mundo " << (level + 1);
    gotoxy(x - 16, y + 1);
    cout << "Querido Heroe " << name << ", ¿podra liberarnos de la ignorancia?";
    gotoxy(0, 0);
}

void NumVisitsTutor(int x, int y, int TutorVisits) {
    gotoxy(x, y);
    cout << "Numero de visitas al Tutor: " << TutorVisits;
    gotoxy(0, 0);
}

void NumVisitsEnemy(int x, int y, int EnemyVisits) {
    gotoxy(x, y);
    cout << "Numero de visitas al Enemigo: " << EnemyVisits;
    gotoxy(0, 0);
}

/*
Efectos de Mensaje
*/
void printGradually(const string& message, int delay) {
    for (char c : message) {
        cout << c << flush; // Asegura que el carácter se imprima inmediatamente
        Sleep(delay); // Retraso
    }
    cout << endl; // Salto de línea al final del mensaje
}

void printBlinkingText(const string& text, int x, int y) {
    while (true) {
        if (_kbhit()) {
            // Si se ha presionado una tecla, detener el parpadeo y salir del bucle
            break;
        }
        gotoxy(x, y);
        cout << text << flush; // Imprimir texto
        Sleep(500); // Retraso

        // Mover el cursor atrás y borrar el texto
        cout << "\033[1K\r" << flush; // Código de escape ANSI para borrar texto
        Sleep(500); // Retraso
    }
}

/*
Movimiento de los Tutores y Enemigos
*/
void moveCharacter(char board[height][width], int& posY, int& posX) {
    int move = rand() % 4;
    switch (move) {
    case 0: if (board[posY - 1][posX] == ' ') posY--; break;
    case 1: if (board[posY][posX - 1] == ' ') posX--; break;
    case 2: if (board[posY + 1][posX] == ' ') posY++; break;
    case 3: if (board[posY][posX + 1] == ' ') posX++; break;
    }
}

void moveCharacters(char board[height][width], int posYChars[], int posXChars[]) {
    for (int i = 0; i < numCharacters; ++i) {
        moveCharacter(board, posYChars[i], posXChars[i]);
    }
}

/*
Tutoriales
*/
void showPythagorasCuriousThings() {
    clearScreen();
    int input;
    cout << "Ingresa un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato curioso sobre Pitagoras:" << endl;
    case 1:
        cout << "El 'Padre de los Numeros':" << endl;
        cout << "Sobre su atribucion como el 'Padre de los Numeros' debido a su fundamental contribucion a las matematicas." << endl;
        cout << "El famoso Teorema de Pitagoras se sigue ensenando hasta el dia de hoy." << endl;
        cout << "Sigue la Matematica con pasion en este mundo lleno de descubrimientos" << endl;
        break;
    case 2:
        cout << "Fundador de una Escuela Secreta:" << endl;
        cout << "Sobre su fundacion de una escuela en Crotona, donde sus seguidores, aprendian con el, Matematicas, Filosofia y Musica." << endl;
        cout << "La escuela funcionaba casi como una sociedad secreta con sus propios ritos y reglas." << endl;
        cout << "Aun tienes mucho por descubrir en este mundo de las Matematicas" << endl;
        break;
    case 3:
        cout << "Amor por la Musica:" << endl;
        cout << "Pitagoras creia que la Musica y las Matematicas estaban conectadas. Descubrio que las Matematicas podian representar tonos musicales." << endl;
        cout << "Este hallazgo se convirtio en la base de la teoria musical." << endl;
        cout << "¿Quien lo diria?, Pitagoras pudo ser cantante" << endl;
        break;
    case 4:
        cout << "Creencia en la Reencarnacion:" << endl;
        cout << "Pitagoras creia en la Reencarnacion, la idea del renacer, el alma entrando a un nuevo cuerpo." << endl;
        cout << "Pensaba que las almas podian reencarnar tanto en humanos como animales." << endl;
        cout << "Animate, podrias ser el siguiente Pitagoras" << endl;
        break;
    case 5:
        cout << "El Numero 10 como Sagrado:" << endl;
        cout << "Para Pitagoras y sus seguidores, el numero 10 era sagrado y perfecto." << endl;
        cout << "Lo representaban con un simbolo llamado tetraktys, que es un triangulo formado por diez puntos dispuestos en cuatro filas." << endl;
        cout << "Diez de diez" << endl;
        break;
    case 6:
        cout << "Primero en llamarse Filosofo:" << endl;
        cout << "Se le atribuye haber sido el primero en usar la palabra 'filosofo' para describirse a sí mismo." << endl;
        cout << "La historia detras de este término es interesante y revela mucho sobre la vision que Pitagoras tenía de la vida y el conocimiento." << endl;
        cout << "Bastante inspirador" << endl;
        break;
    case 7:
        cout << "Los Numeros Tienen Personalidades:" << endl;
        cout << "Pitagoras y sus seguidores creian que los numeros tenian personalidades y cualidades propias." << endl;
        cout << "Por ejemplo, pensaban que el numero 1 era masculino y creativo, mientras que el numero 2 era femenino y pasivo." << endl;
        cout << "¿Que numeros seriamos?" << endl;
        break;
    default:
        clearScreen();
        showPythagorasCuriousThings();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showPythagorasTheorem() {
    clearScreen();
    int input;
    cout << "Ingresa un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato sobre la utilidad del Teorema de Pitagoras:" << endl;
    case 1:
        cout << "Hipotenusa:" << endl;
        cout << "La hipotenusa es siempre el lado opuesto al ángulo recto en un triangulo rectangulo y es el lado más largo." << endl;
        cout << "La formula a^2 + b^2 = c^2 permite calcular la longitud de la hipotenusa si se conocen las longitudes de los otros dos lados." << endl;
        cout << "¿Te imaginas cuantas veces ha sido usado el teorema?" << endl;
        break;
    case 2:
        cout << "No fue descubierto solo por Pitagoras:" << endl;
        cout << "Aunque el teorema lleva su nombre, hay evidencia de que el conocimiento de esta relacion matematica existia en otras culturas antiguas." << endl;
        cout << "Sin embargo, Pitagoras es a menudo acreditado con su primera demostracion formal." << endl;
        cout << "Vaya, el Teorema de Pitagoras, no provino de Pitagoras" << endl;
        break;
    case 3:
        cout << "Aplicaciones en la vida diaria:" << endl;
        cout << "El teorema de Pitagoras se utiliza en muchas areas practicas, como la construccion, la navegacion y la arquitectura." << endl;
        cout << "Por ejemplo, los arquitectos y constructores lo usan para asegurarse de que los angulos de las esquinas sean rectos." << endl;
        cout << "Tal vez, tu, futuro Ingeniero, lo vayas a necesitar" << endl;
        break;
    case 4:
        cout << "Relacion con los triangulos rectangulos:" << endl;
        cout << "El teorema de Pitágoras solo se aplica a los triangulos rectangulos, es decir, aquellos que tienen un angulo de 90 grados." << endl;
        cout << "La formula relaciona las longitudes de los lados del triangulo, donde c es la hipotenusa (el lado mas largo), y a y b son los otros lados" << endl;
        cout << "Util, ¿verdad?" << endl;
        break;
    case 5:
        cout << "Pruebas diversas:" << endl;
        cout << "Hay mas de 370 pruebas conocidas del teorema de Pitagoras, incluyendo algunas geometricas, algebraicas y por reduccion al absurdo." << endl;
        cout << "Uno de los mas famosos que ofrecio una prueba fue el presidente de los Estados Unidos, James Garfield." << endl;
        cout << "¿Podrias demostrarlo?" << endl;
        break;
    case 6:
        cout << "Pitagoricos y numeros enteros:" << endl;
        cout << "Los seguidores de Pitagoras, conocidos como los pitagoricos, estaban muy interesados en los numeros y descubrieron que en algunos triangulos rectangulos, los tres lados pueden ser numeros enteros." << endl;
        cout << "Estos conjuntos de numeros se conocen como triadas pitagoricas. Un ejemplo clasico es (3, 4, 5), donde 3^2 + 4^2 = 5^2 (9 + 16 = 25)" << endl;
        cout << "Muchos nos hemos convertido en Pitagoricos" << endl;
        break;
    case 7:
        cout << "Teorema inverso:" << endl;
        cout << "Si en un triangulo, el cuadrado de un lado es igual a la suma de los cuadrados de los otros dos lados." << endl;
        cout << "Entonces el triangulo es un triangulo rectangulo. Esto se utiliza a menudo para verificar si un triangulo es rectangulo." << endl;
        cout << "Hay mas utilidades del Teorema de Pitagoras" << endl;
        break;
    default:
        clearScreen();
        showPythagorasTheorem();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showPythagorasVectors() {
    clearScreen();
    int input;
    cout << "Ingresa un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato sobre el Teorema de Pitagoras en los Vectores:" << endl;
    case 1:
        cout << "Magnitud de un Vector:" << endl;
        cout << "La magnitud (o longitud) de un vector V se puede encontrar utilizando el teorema de Pitagoras." << endl;
        cout << "La magnitud se calcula como: |V| = sqrt(V_x^2 + V_y^2)" << endl;
        cout << "Asi es como desarrollamos la magnitud de un vector" << endl;
        break;
    case 2:
        cout << "Distancia entre Dos Puntos:" << endl;
        cout << "El teorema de Pitagoras tambien se utiliza para calcular la distancia entre dos puntos en el plano. Si tienes dos puntos A(x_1, y_1) y B(x_2, y_2)." << endl;
        cout << "La distancia entre estos dos puntos se calcula como: |AB| = sqrt((x_2-x_1)^2 + (y_2-y_1)^2)" << endl;
        cout << "Ahora sabes mas sobre el el uso del Teorema de Pitagoras en vectores" << endl;
        break;
    case 3:
        cout << "Vectores en el Espacio:" << endl;
        cout << "Para un vector en el espacio tridimensional V = (V_x, V_y, V_z), el teorema se extiende de manera similar:" << endl;
        cout << "|V| = sqrt(V_x^2 + V_y^2 + V_z^2)" << endl;
        cout << "Una de las otras utilidades del Teorema de Pitagoras" << endl;
        break;
    case 4:
        cout << "Suma de Vectores:" << endl;
        cout << "Cuando sumamos dos vectores que son perpendiculares entre si, la magnitud del vector resultante se puede encontrar usando el teorema de Pitagoras." << endl;
        cout << "Si A y B son perpendiculares, R = A + B. La magnitud de R se puede calcular como: |R| = sqrt(|A|^2 + |B|^2)" << endl;
        cout << "Mas utilidades del Teorema de Pitagoras, sigue asi" << endl;
        break;
    case 5:
        cout << "Aplicaciones en Fisica:" << endl;
        cout << "En fisica, el teorema de Pitagoras es fundamental para resolver problemas relacionados con:" << endl;
        cout << "Desplazamiento, Fuerza Resultante, Velocidad y Aceleracion" << endl;
        cout << "Podemos medir ahora en la Fisica" << endl;
        break;
    case 6:
        cout << "Geometria y Trigonometria:" << endl;
        cout << "El teorema de Pitagoras es la base para muchas formulas trigonometricas y es utilizado para derivar las relaciones entre las funciones trigonometricas en un triangulo rectangulo." << endl;
        cout << "Ademas, se usa para resolver problemas en geometria analitica y algebra vectorial." << endl;
        cout << "El teorema de Pitagoras es profundo" << endl;
        break;
    case 7:
        cout << "Norma Euclidiana en el Espacio n-Dimensional" << endl;
        cout << "Para un vector V en un espacio n - dimensional, representado como V = (V_1, V_2, ... , V_n) la norma euclidiana se calcula extendiendo el teorema de Pitagoras a mas dimensiones" << endl;
        cout << "La formula general es: |V| = sqrt(V_1^2 + V_2^2 + ... + V_n^2)" << endl;
        cout << "Bastante utilizado en diferentes ramas del conocimiento" << endl;
        break;
    default:
        clearScreen();
        showPythagorasVectors();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showPythagorasTutorial_A() {
    clearScreen();
    int input;
    cout << "Ahora un Tutorial sobre Pitagoras" << endl;
    cout << "Selecciona que tutorial deseas:" << endl;
    cout << "1. Datos Curiosos sobre Pitagoras" << endl;
    cout << "2. Usos del Teorema de Pitagoras en el triangulo" << endl;
    cout << "3. El Teorema de Pitagoras en los vectores" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
    case 1: showPythagorasCuriousThings();
        break;
    case 2: showPythagorasTheorem();
        break;
    case 3: showPythagorasVectors();
        break;
    default:
        clearScreen();
        showPythagorasTutorial_A();
    }
}

void showEquationsCuriousThings() {
    clearScreen();
    int input;
    cout << "Selecciona un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato curioso sobre las ecuaciones:" << endl;
    case 1:
        cout << "Origen Antiguo" << endl;
        cout << "Las ecuaciones de primer grado tienen una historia muy antigua." << endl;
        cout << "Los babilonios ya resolvían ecuaciones lineales alrededor del 1900 a.C. utilizando metodos geometricos y aritmeticos." << endl;
        cout << "Hace mucho tiempo" << endl;
        break;
    case 2:
        cout << "Simplicidad y Versatilidad" << endl;
        cout << "A pesar de su simplicidad, las ecuaciones de primer grado son fundamentales en matematicas y ciencias." << endl;
        cout << "Pueden describir una amplia variedad de situaciones, desde problemas financieros hasta relaciones fisicas basicas." << endl;
        cout << "Hasta para calcular tus gastos" << endl;
        break;
    case 3:
        cout << "Representacion Grafica" << endl;
        cout << "En un sistema de coordenadas cartesianas, la grafica de una ecuación de primer grado con dos variables y = mx + b es una linea recta." << endl;
        cout << "Aquí, m representa la pendiente de la línea y b el punto donde la línea intercepta el eje y." << endl;
        cout << "Interesante ¿verdad?" << endl;
        break;
    case 4:
        cout << "Propiedades Importantes" << endl;
        cout << "La solución de una ecuacion de primer grado siempre es unica." << endl;
        cout << "Esto significa que para cualquier ecuacion de la forma ax + b = 0, siempre habra una unica solucion para x (si a es diferente de 0)." << endl;
        cout << "Sigue asi" << endl;
        break;
    case 5:
        cout << "Metodos de Resolucion" << endl;
        cout << "Las ecuaciones de primer grado pueden resolverse de varias maneras, incluyendo:" << endl;
        cout << "Despeje (mover terminos de un lado a otro para aislar la variable), Graficamente (interseccion de lineas) y metodo de igualacion, sustitucion y eliminacion." << endl;
        cout << "Ahora sabes la resolucion de ecuaciones" << endl;
        break;
    case 6:
        cout << "Aplicaciones Practicas" << endl;
        cout << "Se utilizan en finanzas para calcular intereses simples y compuestos. En fisica, para describir relaciones basicas como la velocidad constante (v = d/t)." << endl;
        cout << "En economia, para encontrar puntos de equilibrio entre oferta y demanda." << endl;
        cout << "Futuro Ingeniero, lo necesitaras" << endl;
        break;
    case 7:
        cout << "Simbolismo Historico" << endl;
        cout << "Los matematicos antiguos usaban diferentes metodos simbolicos para representar y resolver ecuaciones lineales." << endl;
        cout << "Por ejemplo, los arabes utilizaron el termino 'resto' para describir la ecuacion de balanceo, de ahi el termino 'al - jabr', que eventualmente evoluciono en la palabra 'algebra'." << endl;
        cout << "¿Sabes de donde deriva tu nombre?" << endl;
        break;
    default:
        clearScreen();
        showEquationsCuriousThings();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showEquationsUtility() {
    clearScreen();
    int input;
    cout << "Selecciona un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato sobre la utilidad de las ecuaciones:" << endl;
    case 1:
        cout << "Modelado de Situaciones Reales" << endl;
        cout << "Las ecuaciones se utilizan para modelar y resolver problemas en diversas disciplinas como:" << endl;
        cout << "Fisica, quimica, biologia, economia y ingenieria." << endl;
        cout << "Bastante util" << endl;
        break;
    case 2:
        cout << "Prediccion y Pronostico" << endl;
        cout << "En economia, las ecuaciones ayudan a predecir tendencias de mercado y comportamientos financieros." << endl;
        cout << "Muchos utilizados a traves de modelos econometricos." << endl;
        cout << "Se pueden predecir muchas mas cosas" << endl;
        break;
    case 3:
        cout << "Optimizacion" << endl;
        cout << "En logistica y negocios, las ecuaciones se usan para optimizar rutas de transporte, produccion y distribucion." << endl;
        cout << "Minimizando costos y maximizando eficiencia." << endl;
        cout << "Vaya, deberiamos hacerlo" << endl;
        break;
    case 4:
        cout << "Ingenieria y Diseno" << endl;
        cout << "Los ingenieros utilizan ecuaciones para diseñar:" << endl;
        cout << "Estructuras, circuitos electricos, sistemas mecanicos y otros proyectos complejos." << endl;
        cout << "¡Puedes crear puentes, robots y mucho mas!" << endl;
        break;
    case 5:
        cout << "Medicina y Biologia" << endl;
        cout << "Las ecuaciones modelan:" << endl;
        cout << "La propagacion de enfermedades, el crecimiento de poblaciones celulares y la dinamica de sistemas biologicos." << endl;
        cout << "¡Ayuda a salvar vidas y descubrir curas!" << endl;
        break;
    case 6:
        cout << "Ciencias Sociales" << endl;
        cout << "Se emplean para analizar datos y hacer inferencias en sociologia, psicologia y ciencias politicas." << endl;
        cout << "Ayudando a entender y predecir comportamientos humanos y sociales." << endl;
        cout << "¡Descubre por que las personas hacen lo que hacen!" << endl;
        break;
    case 7:
        cout << "Tecnologia de la Informacion" << endl;
        cout << "En informatica, las ecuaciones se utilizan en algoritmos, criptografia y analisis de datos." << endl;
        cout << "Mejorando la eficiencia y seguridad de los sistemas informaticos." << endl;
        cout << "¡Imagina poder crear tu propio videojuego o una app increíble!" << endl;
        break;
    default:
        clearScreen();
        showEquationsUtility();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showEquationsHistory() {
    clearScreen();
    int input;
    cout << "Selecciona un numero del 1 al 7:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un dato sobre la historia de las ecuaciones:" << endl;
    case 1:
        cout << "Babilonia" << endl;
        cout << "Los babilonios (alrededor de 2000 a.C.) resolvian ecuaciones cuadraticas y cubicas utilizando metodos aritmeticos y geometricos." << endl;
        cout << "Tambien desarrollaron tablas matematicas, como las de multiplicación y de logaritmos, que facilitaban sus calculos." << endl;
        cout << "¡Descubre como puedes desarrollar tus tablas!" << endl;
        break;
    case 2:
        cout << "Grecia Antigua" << endl;
        cout << "Euclides y Diofanto hicieron contribuciones significativas al algebra y a la teoria de ecuaciones en el siglo III a.C." << endl;
        cout << "Ademas, los griegos introdujeron el concepto de demostracion matematica formal, que sento las bases para el desarrollo de la geometria y el algebra." << endl;
        cout << "¡Animate, podrias sentar las bases de la era Revolucionaria!" << endl;
        break;
    case 3:
        cout << "Matematicos Arabes" << endl;
        cout << "Al-Juarismi, un matematico persa del siglo IX." << endl;
        cout << "Escribio un libro que sistematizo la resolucion de ecuaciones lineales y cuadraticas, dando origen a la palabra 'algebra'." << endl;
        cout << "Tal vez, tu siguiente libro sea un exito, ¡no lo dudes!" << endl;
        break;
    case 4:
        cout << "India" << endl;
        cout << "Matematicos como Brahmagupta (siglo VII) desarrollaron metodos para resolver ecuaciones indeterminadas y cuadraticas." << endl;
        cout << "Tambien introdujeron conceptos avanzados en aritmetica y algebra, como el uso del cero y las propiedades de los numeros negativos." << endl;
        cout << "Aprenderas mas cosas sobre los numeros" << endl;
        break;
    case 5:
        cout << "Edad Media" << endl;
        cout << "Los matematicos europeos como Fibonacci (siglo XIII) reintrodujeron el conocimiento arabe y griego en Europa, incluyendo la resolucion de ecuaciones." << endl;
        cout << "Este periodo tambien vio el desarrollo de la algebra simbolica y metodos avanzados de calculo que sentaron las bases para la revolucion matematica en los siglos posteriores." << endl;
        cout << "¡Probablemente crees una nueva secuencia de numeros!" << endl;
        break;
    case 6:
        cout << "Renacimiento" << endl;
        cout << "Durante el Renacimiento, matematicos italianos como Tartaglia y Cardano resolvieron ecuaciones cubicas y cuarticas" << endl;
        cout << "Expandiendo significativamente el campo del algebra." << endl;
        cout << "Bastante motivador" << endl;
        break;
    case 7:
        cout << "Siglo XIX" << endl;
        cout << "La teoria de Galois revoluciono la comprension de las ecuaciones polinomicas y su resolubilidad, sentando las bases para el algebra moderna." << endl;
        cout << "Este periodo tambien presencio avances significativos en el desarrollo de metodos computacionales y aplicaciones practicas de las matematicas en diversas disciplinas cientificas y tecnologicas." << endl;
        cout << "¡Ya cerca a nuestros tiempos!" << endl;
        break;
    default:
        clearScreen();
        showEquationsHistory();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showEquationsTutorial_X() {
    clearScreen();
    int input;
    cout << "Ahora un Tutorial sobre Ecuaciones" << endl;
    cout << "Selecciona que tutorial deseas:" << endl;
    cout << "1. Datos Curiosos sobre las Ecuaciones" << endl;
    cout << "2. Usos de las Ecuaciones" << endl;
    cout << "3. Historia de las ecuaciones" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
    case 1: showEquationsCuriousThings();
        break;
    case 2: showEquationsUtility();
        break;
    case 3: showEquationsHistory();
        break;
    default: clearScreen(); showEquationsTutorial_X();
    }
}

/*
Estructura para los Desafios
*/
struct Challenge {
    string challengeText;
    string alternatives[3];
    int correctAnswer;
};

/*
Modelo de Pregunta
*/
void askQuestion(const Challenge& challenge) {
    cout << challenge.challengeText << endl;
    cout << "Opciones:" << endl;
    for (int i = 0; i < 3; ++i) {
        cout << i + 1 << ". " << challenge.alternatives[i] << endl;
    }

    int userChoice;
    while (true) {
        cout << "Ingresa tu respuesta (numero de opcion):" << endl;
        cout << "Si crees no estar listo omite el desafio presionando '0':" << endl;
        userChoice = _getch() - '0'; // Convertir carácter a entero

        if (userChoice == 0) {
            cout << "Desafio omitido." << endl;
            Sleep(1000);
            return;
        }
        else if (userChoice >= 1 && userChoice <= 3) {
            if (userChoice == challenge.correctAnswer) {
                cout << "¡Respuesta correcta!" << endl;
                Points += 6; // Aumentamos el puntaje si la respuesta es correcta
            }
            else {
                cout << "Respuesta incorrecta. La respuesta correcta es la opcion: " << challenge.correctAnswer << endl;
                Points -= 2; // Disminuimos el puntaje si la respuesta es incorrecta
            }
            Sleep(1000);
            return; // Salir de la función después de una respuesta válida
        }
        else {
            cout << "Ingresa una opcion valida" << endl;
            Sleep(1000);
            clearScreen();
            cout << challenge.challengeText << endl;
            cout << "Opciones:" << endl;
            for (int i = 0; i < 3; ++i) {
                cout << i + 1 << ". " << challenge.alternatives[i] << endl;
            }
        }
    }
}

void showChallengePythagorasCuriousThings() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge pythagorasChallenges[] = {
        {"¿Como es atribuido Pitagoras?",
         {"Pitagorico", "Padre de la biologia", "Padre de los numeros"},
         3},
        {"¿Donde fundo Pitagoras su escuela?",
         {"Venecia", "Crotona", "Roma"},
         2},
        {"¿Que relacion descubrio Pitagoras en la Matematica con la Musica?",
         {"La Matematicas tienen sus propias notas musicales", "Las Matematicas podian representar las ondas musicales", "Las Matematicas no se relacionan con la Musica"},
         2},
        {"¿En que creian Pitagoras y sus seguidores sobre sus almas?",
         {"En la inmortalidad", "En la resurreccion", "En la reencarnacion"},
         3},
        {"¿Que numeros Pitagoras y sus seguidores considerabam sagrado y perfecto?",
         {"10", "3", "7"},
         1},
        {"¿Como se autodenomino Pitagoras a si mismo?",
         {"Filosofo", "Amador", "Arquitecto"},
         1},
        {"¿Como consideraba Pitagoras al numero 1?",
        {"Inteligente y honesto", "Masculino y creativo", "Femenino y pasivo"},
        2},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre curiosidades de Pitagoras" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(pythagorasChallenges[numChallenge]);
}

void showChallengePythagorasTheorem() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge pythagorasChallenges[] = {
        {"¿En la formula a^2 + b^2 = c^2, que representa la c?",
         {"Diagonal", "Hipotenusa", "Cateto"},
         2},
        {"¿Fue Pitagoras el primero en descubrir 'El Teorema de Pitagoras'?",
         {"Si, fue Pitagoras", "No, antiguas civilizaciones ya lo habian descubierto", "No, fue Platon"},
         2},
        {"¿En que areas es usado el Teorema de Pitagoras?",
         {"Medicina", "Economia", "Navegacion"},
         3},
        {"¿Cuantos grados debe medir un angulo en un triangulo para ser considerado rectangulo?",
         {"90", "85", "45"},
         1},
        {"Aproximadamente, ¿cuantas pruebas hay del Teorema de Pitagoras?",
         {"Mas de 370", "Menos de 250", "Exactamente 600"},
         1},
        {"¿Como se denominaban a los seguidores de Pitagoras?",
         {"Academicos", "Delirantes", "Pitagoricos"},
         3},
        {"¿Como es usado el Teorema Inverso de Pitagoras?",
        {"Para conocer los angulos exteriores de un triangulo", "Para verificar si un triangulo es rectangulo", "Para verificar si un triangulo es escaleno"},
        2},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre el teorema de Pitagoras" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(pythagorasChallenges[numChallenge]);
}

void showChallengePythagorasVectors() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge pythagorasChallenges[] = {
        {"¿Se puede desarrollar la magnitud de un vector usando el teorema de Pitagoras?",
         {"Si", "No, es imposible", "Solo se halla usando ley de senos y cosenos"},
         1},
        {"¿Como es calculada la distancia entre 2 puntos en el plano?",
         {"(x_2 - x_1) + (y_2 - y_1)", "sqrt((x_2 - x_1)^2 + (y_2 - y_1)^2)", "(x_2 * x_1 + y_2 * y_1)^2"},
         2},
        {"¿Como es denotado los componentes de un vector tridimensional?",
         {"a, b, c", "1, 2, 3", "x, y, z"},
         3},
        {"¿Puede saberse la magnitud de un vector resultante de vectores perpendiculares a partir del teorema de Pitagoras?",
         {"No, los angulos deben ser llanos", "Si, sabiendo su perpendicularidad", "No es posible"},
         2},
        {"¿Para que aplicaciones en la Fisica es util el teorema de Pitagoras?",
         {"Peso", "Fuerza Resultante", "Altura"},
         2},
        {"¿En que ambitos de la Geometria y Trigonometria es usado el teorema de Pitagoras?",
        {"Algebra Vectorial", "Arte Moderno", "Aritmetica de Punteros"},
        1},
        {"¿Como se llama a la magnitud de n dimensiones derivado del Teorema de Pitagoras?",
        {"Basicismo", "Norma Neutral", "Norma Euclidiana"},
        3},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre vectores en el Pitagoras" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(pythagorasChallenges[numChallenge]);
}

void showPythagorasChallenge_W() {
    clearScreen();
    int input;
    cout << "¡Colisionaste con el muneco W!" << endl;
    cout << "Ahora un desafio sobre el Teorema de Pitagoras" << endl;
    cout << "Tendras alternativas en el primer mundo, pero asegurate de responder con la respuesta correcta" << endl;
    cout << "¿Sobre que tema deseas ser desafiado?" << endl;
    cout << "1. Desafio sobre datos Curiosos sobre Pitagoras" << endl;
    cout << "2. Desafio sobre el Teorema de Pitagoras" << endl;
    cout << "3. Desafio sobre el Teorema de Pitagoras en los vectores" << endl;
    input = _getch() - '0';
    switch (input) {
    case 1: showChallengePythagorasCuriousThings();
        break;
    case 2: showChallengePythagorasTheorem();
        break;
    case 3: showChallengePythagorasVectors();
        break;
    default: clearScreen(); showPythagorasChallenge_W();
    }
}

void showChallengeEquationsCuriousThings() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge equationsChallenges[] = {
        {"¿Desde que anos ya resolvian ecuaciones lineales?",
         {"Desde 900 a. C.", "Desde 1500 a. C.", "Desde 1900 a. C."},
         3},
        {"¿Donde son fundamentales las ecuaciones lineales?",
         {"En Psicologia", "En Informatica", "En Matematicas y Ciencias"},
         3},
        {"¿Como es la forma de la ecuacion de la recta?",
         {"y^2 = x^2 - b", "y = x^2 + x + b", "y = mx + b"},
         3},
        {"¿La ecuacion de primer grado tiene unica solucion?",
         {"Si, tiene unica solucion", "No tiene soluciones", "No, tiene 2 soluciones"},
         1},
        {"¿Cual de las siguientes alternativas es un metodo de resolucion de ecuaciones?",
         {"La potenciacion", "La sustitucion", "La diferencia"},
         2},
        {"¿En que area de laburo se usan las ecuaciones lineales para hallar la velocidad?",
         {"Fisica", "Economia", "Arquitectura"},
         1},
        {"¿De que palabra deriva la palabra 'Algebra'?",
        {"La palabra, no derivo", "Al - jabr", "Jabe-rra"},
        2},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre curiosidades de Ecuaciones" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(equationsChallenges[numChallenge]);
}

void showChallengeEquationsUtility() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge equationsChallenges[] = {
        {"¿En que disciplinas el modelado de ecuaciones es util?",
         {"Gastronomia","Ingenieria", "Psicologia"},
         2},
        {"¿En la Economia, que predicen las ecuaciones?",
         {"Tasas de interes", "Eventos naturales", "Patrones migratorios"},
         1},
        {"En logistica y negocios, ¿para que son utilizadas las ecuaciones?",
         {"Para mejorar la satisfaccion del cliente", "Para aumentar la visibilidad de la marca", "Para optimizar rutas de transporte"},
         3},
        {"¿Para que los Ingenieros utilizan las ecuaciones?",
         {"Para modelar sistemas financieros", "Para analizar comportamientos de mercado", "Para disenar estructuras"},
         3},
        {"¿Que modelan las ecuaciones en la Medicina y Biologia?",
         {"Modelan el dinamismo celular", "Predicen la propagacion de enfermedades", "Analizan el comportamiento de grupos sociales"},
         1},
        {"¿Para que se utilizan las ecuaciones en las Ciencias Sociales?",
         {"Para disenar politicas publicas", "Para predecir comportamientos humanos", "Para estudiar fenomenos naturales"},
         2},
        {"¿Para que se utilizan las ecuaciones en los sistemas informaticos?",
         {"Para desarrollar estrategias de marketing", "Para entender el comportamiento del consumidor", "Para optimizar la eficiencia y funcionamiento"},
         3},
    };



    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre la utilidad de las ecuaciones" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(equationsChallenges[numChallenge]);
}

void showChallengeEquationsHistory() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge equationsChallenges[] = {
        {"¿Que desarrollaron los Babilonios en 2000 a.C.?",
         {"Tablas de division", "Tablas de multiplicar", "Tablas de suma"},
         2},
        {"¿Quienes introdujeron el concepto de demostracion matematica formal?",
         {"Los croatas", "Los fariseos", "Los griegos"},
         3},
        {"¿Quien fue el autor del libro que introdujo la palabra 'algebra'?",
         {"Al-Ahly", "Al-Kebab", "Al-Juarismi"},
         3},
        {"¿Quienes introdujeron soluciones a ecuaciones cuadraticas e indeterminadas?",
         {"Los Indios", "Los Americanos", "Los Italianos"},
         1},
        {"¿En que periodo se vio el desarrollo de la Algebra Simbolica?",
         {"Edad Media", "Pentateuco", "Era del Hielo"},
         1},
        {"¿Quien fue uno de los que desarrollo cuarticas y cubicas?",
         {"Isaac Newton", "Cardano", "Leonardo Davinci"},
         2},
        {"¿En que siglo la teoria de Galois revoluciono la Matematica?",
        {"Siglo XX", "Siglo XIX", "Siglo XXI"},
        2},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre la historia de las Ecuaciones" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(equationsChallenges[numChallenge]);
}

void showEquationsChallenge_K() {
    clearScreen();
    int input;
    cout << "¡Colisionaste con el muneco K!" << endl;
    cout << "Ahora un desafio sobre las Ecuaciones" << endl;
    cout << "Tendras alternativas en el primer mundo, pero asegurate de responder con la respuesta correcta" << endl;
    cout << "¿Sobre que tema deseas ser desafiado?" << endl;
    cout << "1. Desafio sobre datos Curiosos sobre Ecuaciones" << endl;
    cout << "2. Desafio sobre la Utilidad de las Ecuaciones" << endl;
    cout << "3. Desafio sobre la Historia de las Ecuaciones" << endl;
    input = _getch() - '0';
    switch (input) {
    case 1: showChallengeEquationsCuriousThings();
        break;
    case 2: showChallengeEquationsUtility();
        break;
    case 3: showChallengeEquationsHistory();
        break;
    default: clearScreen(); showEquationsChallenge_K();
    }
}

void showPythagorasTutorial() {
    clearScreen();
    int input;
    cout << "Selecciona que Tutoria deseas del 1 al 3:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un tutorial sobre el Teorema de Pitagoras:" << endl;
    case 1:
        cout << "Formula" << endl;
        cout << "La formula del teorema de Pitagoras es la siguiente: a^2 + b^2 = c^2" << endl;
        cout << "Donde a y b son catetos y c la Hipotenusa" << endl;
        cout << "Genial, ¿verdad?" << endl;
        break;
    case 2:
        cout << "Identificacion" << endl;
        cout << "Para operar la formula, identifica cuales son los catetos" << endl;
        cout << "A partir de ellos puedes reemplazar, porque ambos catetos al cuadrado resulta la Hipotenusa" << endl;
        cout << "¡Tu puedes!" << endl;
        break;
    case 3:
        cout << "Representacion" << endl;
        cout << "El teorema de Pitagoras siempre aplica a triangulos rectangulos" << endl;
        cout << "Por tanto, en una grafica de un triangulo nota si un angulo mide 90 grados para poder aplicar el teorema de Pitagoras" << endl;
        cout << "¡Lo dominaras!" << endl;
        break;
    default:
        clearScreen();
        showPythagorasTutorial();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showEquationsTutorial() {
    clearScreen();
    int input;
    cout << "Selecciona que tutoria deseas del 1 al 3:" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
        cout << "Ahora un tutorial sobre las Ecuaciones:" << endl;
    case 1:
        cout << "Equivalencia" << endl;
        cout << "La esencia de las ecuaciones fundamenta en la conservacion del estado equitativo de valores" << endl;
        cout << "De tal manera, considerando un igualdad, a partir de operacion que no alteren la igualdad de una ecuacion, se podran descubrir valores para cualquier incognita" << endl;
        cout << "¡Tu puedes!" << endl;
        break;
    case 2:
        cout << "Resolucion" << endl;
        cout << "Al realizar operaciones a ambos lados de la ecuacion, la expresion seguira siendo la misma. En la ecuacion 5 = 5, si operas con una misma exxpresion a ambos lados de la ecuacion" << endl;
        cout << "La ecuacion mantendra su valor porque se esta agregando un valor equitativo, hacia una igualdad, no lo altera" << endl;
        cout << "¡Vamos!" << endl;
        break;
    case 3:
        cout << "Ejemplo:" << endl;
        cout << "x + 4 = 10, al restar 4 a ambos lados de la ecuacion resulta x = 6" << endl;
        cout << "x/3 = 10, al multiplicar 3 a ambos lados de la ecuacion resulta x = 30" << endl;
        cout << "¡Genial!" << endl;
        break;
    default:
        clearScreen();
        showEquationsTutorial();
    }
    printBlinkingText(Espera, 0, 7);
    _getch();
}

void showTutorial_H() {
    clearScreen();
    int input;
    cout << "¡Colisionaste con el muneco H!" << endl;
    cout << "Ahora un Tutorial" << endl;
    cout << "Selecciona que tutorial deseas:" << endl;
    cout << "1. Tutorial sobre el Teorema de Pitagoras" << endl;
    cout << "2. Tutorial sobre las Ecuaciones" << endl;
    input = _getch() - '0'; // Convierte el caracter a entero
    switch (input) {
    case 1: showPythagorasTutorial();
        break;
    case 2: showEquationsTutorial();
        break;
    default: clearScreen(); showTutorial_H();
    }
}

void showPythagorasEnemy() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge pythagorasChallenges[] = {
        {"¿Cuanto es el resultado de 3^2 + 4^2 = x?",
         {"36", "25", "16"},
         2},
        {"¿Como es la formula del teorema de Pitagoras?",
         {"y = mx + b", "No tiene formula", "a^2 + b^2 = c^2"},
         3},
        {"Si un triangulo rectangulo tiene 12 y 5 como catetos, ¿cuanto mide su Hipotenusa?",
         {"No existe", "11", "13"},
         3},
        {"¿Puedo saber la longitud de un cateto, sabiendo la hipotenusa y otro de sus catetos?",
         {"Si", "No hay formula para ello", "No, falta informacion"},
         1},
        {"¿Cual es la formula que determina la longitud de un cateto usando el teorema de Pitagoras?",
         {"c^2 = a^2 + b^2", "b = sqrt(c^2 - a^2)", "Ninguna de las anteriores"},
         2},
        {"¿Fue Pitagoras el primero que descubrio el teorema de Pitagoras?",
         {"No, fue Platon", "Si, fue Pitagoras", "No, antiguas civilizaciones ya lo habian descubierto"},
         3},
        {"¿Cuanto es el resultado de 5^2 + 6^2 = x?",
        {"61", "58", "64"},
        1},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre el teorema de Pitagoras" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(pythagorasChallenges[numChallenge]);
}

void showEquationsEnemy() {
    srand(time(0));
    clearScreen();

    // Definicion de Desafios
    Challenge equationsChallenges[] = {
        {"¿Cuanto es el resultado de 3 + 4?",
         {"6", "7", "8"},
         2},
        {"¿Cuanto resulta x en x - 5 = 10?",
         {"13", "12", "15"},
         3},
        {"¿Cuanto resulta x en x + 5 = 14?",
        {"No existe", "20", "9"},
         3},
        {"¿Cuanto resulta x en x + 20 = 5?",
         {"-15", "0", "12"},
         1},
        {"¿Cuanto resulta x en x - 5 = 16?",
         {"1", "21", "16"},
         2},
        {"¿Cuanto resulta x en x + 9 = 14?",
         {"10", "16", "5"},
         3},
        {"¿Cuanto resulta x en x - 7 = 20?",
        {"27", "21", "24"},
        1},
    };

    int numChallenge = rand() % 7;
    cout << "Bien, escogiste un desafio sobre las Ecuaciones" << endl;
    cout << "Aqui esta el desafio aleatorio numero " << (numChallenge + 1) << ":" << endl;

    askQuestion(equationsChallenges[numChallenge]);
}

void showChallenge_V() {
    clearScreen();
    int input;
    cout << "¡Colisionaste con el muneco V!" << endl;
    cout << "Ahora un desafio sobre las Ecuaciones" << endl;
    cout << "Tendras desafios por escoger en el segundo Mundo, pero asegurate de responder con la respuesta correcta" << endl;
    cout << "¿Sobre que tema deseas ser desafiado?" << endl;
    cout << "1. Desafios sobre el teorema de Pitagoras" << endl;
    cout << "2. Desafios sobre las ecuaciones" << endl;
    input = _getch() - '0';
    switch (input) {
    case 1: showPythagorasEnemy();
        break;
    case 2: showEquationsEnemy();
        break;
    default: clearScreen(); showChallenge_V();
    }
}

void showFinalChallenge_U() {
    clearScreen();
    int input;
    cout << "¡Colisionaste con el jefe final U!" << endl;
    cout << "Ahora un desafio aleatorio" << endl;

    Challenge FinalBossChallenges[] = {
       {"¿Cuanto es el resultado de 3^2?",
        {"7", "5", "9"},
        3},
       {"En la ecuacion 3x + 7 = 25, ¿cuanto vale x?",
        {"6", "9", "18"},
        1},
       {"Teniendo un triangulo con catetos x y 4, e hipotenusa 17, ¿cuanto vale x?",
        {"", "11", "13"},
        1},
       {"¿Teniendo la siguiente ecuacion, (9x - 7)/18 = 2, ¿cuanto vale x?",
        {"4", "0", "No se puede determinar"},
        1},
       {"¿Cual es la formula que determina la longitud de un cateto usando el teorema de Pitagoras?",
        {"c^2 = a^2 + b^2", "b = sqrt(c^2 - a^2)", "Ninguna de las anteriores"},
        3},
       {"¿Fue Pitagoras el primero que descubrio el teorema de Pitagoras?",
        {"No, fue Platon", "Si, fue Pitagoras", "No, antiguas civilizaciones ya lo habian descubierto"},
        1},
       {"¿Cuanto es el resultado de 5^2 + 6^2 = x?",
       {"61", "58", "64"},
        1},
       {"En la ecuacion 5x - 9 = 0, ¿cuanto vale x?",
        {"14", "9", "9/5"},
        3},
       {"En la ecuacion 3x + 7 = 25, ¿cuanto vale x?",
        {"6", "9", "18"},
        2},
       {"Teniendo un triangulo con catetos x y 4, e hipotenusa 17, ¿cuanto vale x?",
        {"g", "11", "13"},
        2},
       {"¿Teniendo la siguiente ecuacion, (9x - 7)/18 = 2, ¿cuanto vale x?",
        {"4", "0", "No se puede determinar"},
        2},
       {"¿Cuanto vale x en la expresion, 2x = 15?",
        {"12", "30", "15/2"},
        3},
       {"¿Es una ecuacion, 5 + 10 = 15?",
        {"No, necesita una incognita", "Si, porque hay una igualdad de terminos", "No, porque los terminos son desiguales"},
        1},
       {"¿Cuanto vale x en, x^2 = 64?",
        {"10", "8", "12"},
        2},
       {"¿Cuanto vale x en, x + 3x = 12?",
        {"1", "2", "3"},
        3},
       {"En la ecuacion, x - 15 = 0, ¿cuanto vale x?",
        {"19", "10", "15"},
        3},
       {"¿Cuanto vale x en la siguiente expresion?, x - 5 = x",
        {"10", "No tiene solucion, porque no hay igualdad de terminos", "15"},
        2},
       {"¿Cuanto vale x en la siguiente expresion?, 5x + 25 = 5",
        {"4", "2", "-4"},
        3},
       {"¿Cuanto vale x?, x - 12 = 8 ",
        {"20", "4", "12"},
        1},
       {"¿x es la unica posible letra para las incognitas?",
        {"Si, unica y exclusivamente", "No, se puede usar cualquier letra", "Es indeterminado"},
        2},
    };
    int numChallenge = rand() % 21;
    cout << "Bien, ahora un desafio aleatorio" << endl;
    cout << "Aqui el desafio " << numChallenge + 1 << endl;
    askQuestion(FinalBossChallenges[numChallenge]);
}

/*
Estética
*/
void LogoIntroduction() {
    clearScreen();
    setColor(3, 0);
    gotoxy(26, 2);
    cout << "  _____         _                  _                   _               ";        gotoxy(26, 3);
    cout << " |__ __| _ __  | |_ _ __  ___   __| |_   _  ____  ____(_) ___  _ ___   ";        gotoxy(26, 4);
    cout << "   | |  | '_ \\ | __| '__|/ _ \\ / _  | | | |/  __|/  __| |/ _ \\| '_  \\  ";    gotoxy(26, 5);
    cout << "  _| |_ | | | || |_| |  | (_) | (_| | |_| |  (__|  (__| | (_) | | | |  ";        gotoxy(26, 6);
    cout << " |_____||_| |_|\\__||_|   \\___/ \\____|\\___/ \\____|\\____|_|\\___/|_| |_|  "; gotoxy(26, 7);
}

void Instructions1() {
    setColor(6, 0);
    gotoxy(26, 9);
    cout << "Caracteristicas principales:";                                             gotoxy(26, 10);
    cout << "Aventuras Matematicas:";                                                   gotoxy(26, 11);
    cout << "Explora diferentes niveles y escenarios, cada uno con sus propios";        gotoxy(26, 12);
    cout << "retos matematicos que pondran a prueba tus conocimientos y habilidades.";  gotoxy(26, 13);
    cout << "Personajes Interactivos:";                                                 gotoxy(26, 14);
    cout << "Interactua con personajes unicos que te ayudaran y te desafiaran";         gotoxy(26, 15);
    cout << "a lo largo de tu viaje en MathWorld.";                                     gotoxy(26, 16);
    cout << "Desafios y Tutoriales:";                                                   gotoxy(26, 17);
    cout << "Completa tutoriales interactivos para aprender nuevas tecnicas y";         gotoxy(26, 18);
    cout << "enfrenta desafios que te permitiran poner a prueba lo aprendido.";         gotoxy(26, 19);
    cout << "Sistema de Puntuacion:";                                                   gotoxy(26, 20);
    cout << "Gana puntos resolviendo problemas y avanzando a traves de los niveles.";   gotoxy(26, 21);
    cout << "Tu objetivo es alcanzar la maxima puntuacion posible.";                    gotoxy(26, 22);
    printBlinkingText(Espera, 26, 23);
    clearScreen();
}

void Instructions2(int x, int y) {
    clearScreen();
    setColor(5, 0);
    gotoxy(x, y);
    cout << "Como Jugar:";
    gotoxy(x, y += 2); setColor(12, 0);
    cout << "Movimiento:";                                                              gotoxy(x, ++y); setColor(8, 0);
    cout << "W: Mover hacia arriba";                                                    gotoxy(x, ++y);
    cout << "A: Mover hacia izquierda";                                                 gotoxy(x, ++y);
    cout << "S: Mover hacia abajo";                                                     gotoxy(x, ++y);
    cout << "D: Mover hacia derecha";
    gotoxy(x, y += 2); setColor(1, 0);
    cout << "Interaccion:";                                                             gotoxy(x, ++y); setColor(8, 0);
    cout << "Interactua con los personajes y el entorno para recibir tutoriales";       gotoxy(x, ++y);
    cout << "y enfrentar desafios.";
    gotoxy(x, y += 2); setColor(6, 0);
    cout << "Puntuacion:";                                                              gotoxy(x, ++y); setColor(8, 0);
    cout << "Gana puntos resolviendo problemas correctamente y evita perder puntos";    gotoxy(x, ++y);
    cout << "por colisiones con enemigos.";                                             gotoxy(x, ++y);
    setColor(7, 0);
    system("pause");
    gotoxy(0, 0);
    clearScreen();
}

void GameModel() {
    clearScreen();
    gotoxy(11, 10);
    setColor(15, 0);
    cout << "Juego 1: Aventura del Conocimiento                                                                  "; gotoxy(11, 11);
    setColor(8, 0);
    cout << "Objetivo:                                                                                           "; gotoxy(11, 12);
    cout << "Acumula 100 puntos enfrentando desafios basados en el Teorema de Pitagoras y Ecuaciones.            "; gotoxy(11, 13);
    cout << "Personajes:                                                                                         "; gotoxy(11, 14);
    cout << "A: Tutor de Pitagoras                                                                               "; gotoxy(11, 15);
    cout << "X: Tutor de Ecuaciones                                                                              "; gotoxy(11, 16);
    cout << "W: Desafio de Pitagoras                                                                             "; gotoxy(11, 17);
    cout << "K: Desafio de Ecuaciones                                                                            "; gotoxy(11, 18);
    cout << "Reglas:                                                                                             "; gotoxy(11, 19);
    cout << "Evita perder puntos colisionando con los tutores y enemigos.                                        "; gotoxy(11, 20);
    cout << "Llega a 100 puntos para pasar al siguiente nivel                                                    "; gotoxy(11, 21);
    resetColor();
    system("pause");
    clearScreen();
    gotoxy(11, 11);
    setColor(15, 0);
    cout << "Juego 2: Resolucion de Problemas                                                                    "; gotoxy(11, 12);
    setColor(6, 0);
    cout << "Objetivo:                                                                                           "; gotoxy(11, 13);
    cout << "Resuelve ecuaciones y problemas algebraicos para ganar puntos y avanzar de nivel.                   "; gotoxy(11, 14);
    cout << "Personajes:                                                                                         "; gotoxy(11, 15);
    cout << "H: Tutor de Algebra                                                                                 "; gotoxy(11, 16);
    cout << "V: Desafio de Variables                                                                             "; gotoxy(11, 17);
    cout << "Reglas:                                                                                             "; gotoxy(11, 18);
    cout << "Cada problema resuelto correctamente te acerca a la victoria.                                       "; gotoxy(11, 19);
    cout << "Cuidado con los desafios, pueden hacerte perder puntos.                                             "; gotoxy(11, 20);
    resetColor();
    system("pause");
    clearScreen();
    gotoxy(11, 12);
    setColor(15, 0);
    cout << "Juego 3: Desafio Final                                                                              "; gotoxy(11, 13);
    setColor(4, 0);
    cout << "Objetivo:                                                                                           "; gotoxy(11, 14);
    cout << "Enfrenta el desafio final resolviendo problemas avanzados y demostrando tus habilidades matematicas."; gotoxy(11, 15);
    cout << "Personajes:                                                                                         "; gotoxy(11, 16);
    cout << "U: Desafio Final                                                                                    "; gotoxy(11, 17);
    cout << "Reglas:                                                                                             "; gotoxy(11, 18);
    cout << "Supera los desafios finales para completar el juego y ganar.                                        "; gotoxy(11, 19);
    resetColor();
    system("pause");
    gotoxy(0, 0);
}

void Welcome() {
    setColor(0, 15);
    gotoxy(36, 11);
    cout << " __  __       _   _       _    _           _     _ ";      gotoxy(36, 12);
    cout << "|  \\/  |     | | | |     | |  | |         | |   | |";     gotoxy(36, 13);
    cout << "| \\  / | __ _| |_| |_    | |  | | ___  ___| |___| |";     gotoxy(36, 14);
    cout << "| |\\/| |/ _` | __| '_ \\  | |/\\| |/ _ \\| __| |  _  |";  gotoxy(36, 15);
    cout << "| |  | | (_| | |_| | | | | /  \\ |||_||| | | | |_| |";     gotoxy(36, 16);
    cout << "|_|  |_|\\__,_|\\__|_| |_| |__/\\__|\\___/\\_| |_|_____|"; gotoxy(36, 17);
    resetColor();
}

int Menu() {
    clearScreen();
    setColor(0, 15);
    gotoxy(36, 8);
    cout << " __  __       _   _       _    _           _     _ ";      gotoxy(36, 9);
    cout << "|  \\/  |     | | | |     | |  | |         | |   | |";     gotoxy(36, 10);
    cout << "| \\  / | __ _| |_| |_    | |  | | ___  ___| |___| |";     gotoxy(36, 11);
    cout << "| |\\/| |/ _` | __| '_ \\  | |/\\| |/ _ \\| __| |  _  |";  gotoxy(36, 12);
    cout << "| |  | | (_| | |_| | | | | /  \\ |||_||| | | | |_| |";     gotoxy(36, 13);
    cout << "|_|  |_|\\__,_|\\__|_| |_| |__/\\__|\\___/\\_| |_|_____|";
    setColor(8, 0);
    gotoxy(36, 15);
    cout << "1. Jugar"; gotoxy(36, 16);
    cout << "2. Salir"; gotoxy(36, 17);
    int input = _getch() - '0';
    switch (input) {
    case 1:
        break;
    case 2:
        exit(0);
    default: Menu();
    }
}

void postCredits(const string& name, int level, int x, int y, int calification, int tutorvisits, int enemyvisits) {
    clearScreen();
    gotoxy(x, y);
    setColor(0, 15);
    cout << " __________________________________________ ";                              gotoxy(x, ++y); Sleep(200);
    cout << "|                                          |";                              gotoxy(x, ++y); Sleep(200);
    cout << "|  Enhorabuena " << name << ", has completado " << level << " niveles  |";  gotoxy(x, ++y); Sleep(200);
    cout << "|                                          |";                              gotoxy(x, ++y); Sleep(200);
    cout << "|------------------------------------------|";                              gotoxy(x, ++y); Sleep(200);
    cout << "|      Tu calificacion es de " << calification << "             |";         gotoxy(x, ++y); Sleep(200);
    cout << "|      Has visitado a los personajes:      |";                              gotoxy(x, ++y); Sleep(200);
    cout << "|      Tutores: " << tutorvisits << "                          |";          gotoxy(x, ++y); Sleep(200);
    cout << "|      Enemigos: " << enemyvisits << "                         |";          gotoxy(x, ++y); Sleep(200);
    cout << "|            Eres ";
    if (calification < 1) {
        cout << "PRINCIPIANTE";
    }
    else if (calification >= 1 && calification < 2) {
        cout << "REGULAR";
    }
    else if (calification >= 2 && calification < 3) {
        cout << "SOBRESALIENTE";
    }
    else if (calification >= 3) {
        cout << "BRILLANTE";
    }
    gotoxy(x + 43, y);
    cout << "|";
    gotoxy(x, ++y);
    cout << "|__________________________________________|";     gotoxy(x, ++y); Sleep(200);
    cout << "/                                          \\";    gotoxy(x, ++y); Sleep(200);
    cout << "                                            ";     gotoxy(x, ++y); Sleep(200);
    cout << "\\__________________________________________/";
    printBlinkingText(Despedida, x+11, y-1);
    _getch();
    gotoxy(0, 0);
    resetColor();
}

void Transition(int x, int y, int level) {
    gotoxy(0, 0);
    clearScreen();
    setColor(7, 0);
    gotoxy(x, ++y);
    cout << " _____                                        _               _                              _       ";             gotoxy(x, ++y); Sleep(200);
    cout << "|  _  \\ _                               _    | |             | |                            | |      ";            gotoxy(x, ++y); Sleep(200);
    cout << "| |_) |(_) ___  _ __ __  __ ___  _ __  (_) __| | ___     ___ | |   _ __ ___  _   _ _ __   __| | ___  ";             gotoxy(x, ++y); Sleep(200);
    cout << "|  _  </ \\/ _ \\| ´_ \\\\ || // _ \\| ´_ \\ / \\/ _` |/ _ \\   / _ ´| |  | ´_ ´ _ \\| | | | ´_ \\ / _` |/ _ \\ ";  gotoxy(x, ++y); Sleep(200);
    cout << "| |_) || |  __/| | | ||||||  __/| | | || | (_| | (_) | | (_| | |  | | | | | | |_| | | | | (_| | (_) |";             gotoxy(x, ++y); Sleep(200);
    cout << "|_____/|_|\\___||_| |_|\\__/ \\___||_| |_||_|\\__,_|\\___/   \\___´|_|  |_| |_| |_|\\___/|_| |_|\\__,_|\\___/ ";    gotoxy(x, ++y);
    if (level + 1 == 1) {
        setColor(3, 1);
        gotoxy(x += 43, y += 2);
        Sleep(500);
        cout << " _    __    _ "; gotoxy(x, ++y); Sleep(500);
        cout << "|_|  /  |  |_|"; gotoxy(x, ++y); Sleep(500);
        cout << "    |/| |     "; gotoxy(x, ++y); Sleep(500);
        cout << "      | |     "; gotoxy(x, ++y); Sleep(500);
        cout << "     _| |_    "; gotoxy(x, ++y); Sleep(500);
        cout << "    |_____|   "; gotoxy(x, ++y); Sleep(500);
        cout << "              "; Sleep(500);
    }
    if (level + 1 == 2) {
        setColor(5, 14);
        gotoxy(x += 43, y += 2);
        Sleep(500);
        cout << " _   ____   _ "; gotoxy(x, ++y); Sleep(500);
        cout << "|_| /  _ \\ |_|"; gotoxy(x, ++y); Sleep(500);
        cout << "    |_// |    "; gotoxy(x, ++y); Sleep(500);
        cout << "      / /     "; gotoxy(x, ++y); Sleep(500);
        cout << "     / /_     "; gotoxy(x, ++y); Sleep(500);
        cout << "    |____|    "; gotoxy(x, ++y); Sleep(500);
        cout << "              "; Sleep(500);
    }
    if (level + 1 == 3) {
        setColor(12, 15 );
        gotoxy(x += 43, y += 2);
        Sleep(500);
        cout << " _   ____   _ "; gotoxy(x, ++y); Sleep(500);
        cout << "|_| |__  | |_|"; gotoxy(x, ++y); Sleep(500);
        cout << "      _| |    "; gotoxy(x, ++y); Sleep(500);
        cout << "     |_  |    "; gotoxy(x, ++y); Sleep(500);
        cout << "     __| |    "; gotoxy(x, ++y); Sleep(500);
        cout << "    |____|    "; gotoxy(x, ++y); Sleep(500);
        cout << "              "; Sleep(500);
    }
    resetColor();
    gotoxy(0, 0);
    _getch();
    clearScreen();
}

void UPClogo(int x, int y) {
    clearScreen();
    gotoxy(x, y);
    const int height = 20;
    const int width = 40;
    int UPC[height][width] = {
        {2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
        {2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
        {2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,2,2},
        {2,2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,2,2},
        {2,2,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,2,2},
        {2,2,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,2,2},
        {2,2,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,2,2},
        {2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,2,2},
        {2,2,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,2,2},
        {2,2,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,2,2},
        {2,2,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2},
        {2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2},
        {2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
        {2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},

    };
    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; ++j) {
            if (UPC[i][j] == 0) {
                setColor(15, 0);
                cout << "#";
            }
            if (UPC[i][j] == 1) {
                setColor(4, 0);
                cout << "#";
            }
            if (UPC[i][j] == 2) {
                setColor(8, 0);
                cout << "#";
            }
        }
        gotoxy(x, y++);
    }
    gotoxy(x+=9, y++);
    cout << "-Exigete, Innova, UPC-";
    Sleep(3000);
    gotoxy(0, 0);
    clearScreen();
    resetColor();
}

void Gratitude(int x, int y) {
    clearScreen();
    gotoxy(x, y);
    cout << "Con esto nos despedimos";                                                                          gotoxy(x, ++y);
    cout << "Ha sido un gusto que probases nuestro juego";                                                      gotoxy(x, y+=2); setColor(6, 0);
    cout << "Beneficios Educativos:";                                                                           gotoxy(x, ++y);    setColor(9, 0);
    cout << "Desarrollo de Habilidades Matematicas:";                                                           gotoxy(x, ++y);    setColor(15, 0);
    cout << "Refuerza y mejora tus conocimientos en geometria, algebra y resolucion de problemas.";             gotoxy(x, ++y);    setColor(9, 0);
    cout << "Aprendizaje Interactivo:";                                                                         gotoxy(x, ++y);    setColor(15, 0);
    cout << "Aprende de manera dinamica y divertida con tutoriales y desafos integrados en el juego.";          gotoxy(x, ++y);    setColor(9, 0);
    cout << "Motivacion y Logros:";                                                                             gotoxy(x, ++y);    setColor(15, 0);
    cout << "Manten la motivacion con un sistema de puntuacion y logros que te incentiva a seguir mejorando.";  gotoxy(x+=2, y+=2);
    cout << "Estudiante: Jean Franck Loa Rojas - Curso: Introduccion a los Algoritmos - Seccion: CC1L";
    resetColor();
    _getch();
}

void Presentacion(int x, int y) {
    gotoxy(x, y);
    string Purpose[4] = {
        " MathWorld no es solo un juego, es una aventura educativa disenada ",
        " para desafiar tu mente y hacer que la matematicas sean divertidas ",
        " y emocionantes. ¡Unete a la aventura y demuestra tus habilidades  ",
        "                      matematicas en MathWorld!                    "
    };
    for (int i = 0; i < 4; ++i) {
        setColor(8, 0);
        printGradually(Purpose[i], 50);
        gotoxy(x, ++y);
    }
    resetColor();
    clearScreen();
}

string Name; // Nombre del Jugador
char O = 'O'; // Caracter para Heroe O

/*
Muñecos del Nivel 1
*/
// Posiciones iniciales de los muñecos A
int posXChars_A[numCharacters] = {};
int posYChars_A[numCharacters] = {};

// Posiciones iniciales de los muñecos X
int posXChars_X[numCharacters] = {};
int posYChars_X[numCharacters] = {};

// Posiciones iniciales de los muñecos W
int posXChars_W[numCharacters] = {};
int posYChars_W[numCharacters] = {};

// Posiciones iniciales de los muñecos K
int posXChars_K[numCharacters] = {};
int posYChars_K[numCharacters] = {};

char A = 'A'; // Caracter para Tutor A
char X = 'X'; // Caracter para Tutor X
char W = 'W'; // Caracter para Desafiante W
char K = 'K'; // Caracter para Desafiante K

/*
Muñecos del Nivel 2
*/
// Posiciones iniciales de los muñecos H
int posXChars_H[numCharacters] = {};
int posYChars_H[numCharacters] = {};

// Posiciones iniciales de los muñecos V
int posXChars_V[numCharacters] = {};
int posYChars_V[numCharacters] = {};

char H = 'H'; // Caracter para Tutor H
char V = 'V'; // Caracter para Enemigo V

/*
Muñecos del Nivel 3
*/
// Posiciones iniciales de los muñecos U
int posXChars_U[numCharacters] = {};
int posYChars_U[numCharacters] = {};

char U = 'U'; // Caracter para el Jefe Final


/*
Validación de Tableros
*/

void BoardValidation1() {
    // Inicializamos el tablero con espacios en blanco y bordes
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            // Dibujar bordes
            if (i == 0 || i == height - 1 || j == 0 || j == width - 1)
                board[i][j] = '#'; // Carácter para el borde
            else
                board[i][j] = ' '; // Espacio en blanco para el interior
        }
    }
    // Añadir obstáculos al tablero
    srand(time(0));
    int numObstacles = 300; // Número de obstáculos
    for (int i = 0; i < numObstacles; ++i) {
        int obsX, obsY;
        do {
            obsX = rand() % (width - 2) + 1; // Generar coordenada X aleatoria dentro del tablero
            obsY = rand() % (height - 2) + 1; // Generar coordenada Y aleatoria dentro del tablero
            validPosition = true;
            // Verificar que la posición no sea la inicial del muñeco O
            if (obsX == posX && obsY == posY) {
                validPosition = false;
            }
            else { // Verificar con
                for (int j = 0; j < numCharacters; ++j) {
                    if ((obsX == posXChars_A[j] && obsY == posYChars_A[j]) ||
                        (obsX == posXChars_X[j] && obsY == posYChars_X[j]) ||
                        (obsX == posXChars_W[j] && obsY == posYChars_W[j]) ||
                        (obsX == posXChars_K[j] && obsY == posYChars_K[j])) {
                        validPosition = false;
                        break;
                    }
                }
            }
        } while (!validPosition || board[obsY][obsX] != ' '); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
        board[obsY][obsX] = '#'; // Carácter para el obstáculo
    }
}

void BoardValidation2() {
    // Inicializamos el tablero con espacios en blanco y bordes
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            // Dibujar bordes
            if (i == 0 || i == height - 1 || j == 0 || j == width - 1)
                board[i][j] = '#'; // Carácter para el borde
            else
                board[i][j] = ' '; // Espacio en blanco para el interior
        }
    }
    // Añadir obstáculos al tablero
    srand(time(0));
    int numObstacles = 300; // #include "pch.h"
#include <iostream>
#include <conio.h>
#include <windows.h>
#include <iomanip>
using namespace std;
using namespace System;
// Chat GPT
void hidecursor() {
	HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
	CONSOLE_CURSOR_INFO info;
	GetConsoleCursorInfo(consoleHandle, &info);
	info.bVisible = FALSE;
	SetConsoleCursorInfo(consoleHandle, &info);
}
// ChatGPT
void setColor(int textColor, int bgColor) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}
// ChatGPT
void resetColor() {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, 7);
}
int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}
int randDX() {
	int num = rand() % 2;
	switch (num) {
	case 0:
		num = -1;
		break;
	case 1:
		num = 1;
		break;
	}
	return num;
}
int randDY() {
	int num = rand() % 2;
	switch (num) {
	case 0:
		num = -1;
		break;
	case 1:
		num = 1;
		break;
	}
	return num;
}
int randX() {
	return 2 + rand() % (46 - 1 + 1);
}
int randY() {
	return 2 + rand() % (20 - 1 + 1);
}
char randRecurso() {
	int num = rand() % 3;
	char recurso = ' ';
	switch (num) {
	case 0:
		recurso = '~';
		break;
	case 1:
		recurso = '*';
		break;
	case 2:
		recurso = '#';
		break;
	}
	return recurso;
}

class Obstaculo {
private:
	int x, y;
	char forma;
public:
	Obstaculo(int x, int y, char forma) : x(x), y(y), forma(forma) {}
	~Obstaculo() {}
	void dibujar() {
		Console::SetCursorPosition(x, y);
		cout << forma;
	}
	void setForma(char forma) {
		this->forma = forma;
	}
	void setX(int x) {
		this->x = x;
	}
	void setY(int y) {
		this->y = y;
	}
	char getForma() {
		return this->forma;
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Tablero {
protected:
	int ANCHO;
	int LARGO;
	char** TABLERO;
	Obstaculo** obstaculos;
	int n_Obstaculos;
public:
	Tablero() : ANCHO(25), LARGO(50), TABLERO(nullptr), obstaculos(nullptr), n_Obstaculos(60) {
		TABLERO = new char* [ANCHO];
		for (int i = 0; i < ANCHO; ++i) {
			TABLERO[i] = new char[LARGO];
		}
		for (int i = 0; i < ANCHO; ++i) {
			for (int j = 0; j < LARGO; ++j) {
				// Bordes
				if (i == 0 && j == 0) {
					TABLERO[i][j] = 201;
				}
				else if (i == 0 && j == LARGO - 1) {
					TABLERO[i][j] = 187;
				}
				else if (i == ANCHO - 1 && j == 0) {
					TABLERO[i][j] = 200;
				}
				else if (i == ANCHO - 1 && j == LARGO - 1) {
					TABLERO[i][j] = 188;
				}
				// Paredes
				else if (i == 0 && j > 0 && j < LARGO - 1) {
					TABLERO[i][j] = 205;
				}
				else if (i > 0 && i < ANCHO - 1 && j == 0) {
					TABLERO[i][j] = 186;
				}
				else if (i == ANCHO - 1 && j > 0 && j < LARGO - 1) {
					TABLERO[i][j] = 205;
				}
				else if (i > 0 && i < ANCHO - 1 && j == LARGO - 1) {
					TABLERO[i][j] = 186;
				}
				else {
					TABLERO[i][j] = ' ';
				}
			}
			obstaculos = new Obstaculo * [n_Obstaculos];
			bool valid;
			int posX;
			int posY;
			for (int i = 0; i < n_Obstaculos; ++i) {
				do {
					valid = true;
					posX = randX();
					posY = randY();
					if ((posX > 22 && posX < 27) && (posY > 11 && posY < 15)) {
						valid = false;
					}
				} while (!valid);
				obstaculos[i] = new Obstaculo(posX, posY, 206);
			}
		}
	}
	~Tablero() {
		for (int i = 0; i < ANCHO; ++i) {
			delete[] TABLERO[i];
		}
		delete[] TABLERO;
	}
	void DIBUJAR_MAPA() {
		for (int i = 0; i < ANCHO; ++i) {
			for (int j = 0; j < LARGO; ++j) {
				cout << TABLERO[i][j];
			}
			cout << endl;
		}
	}
	void DIBUJAR_OBSTACULOS() {
		for (int i = 0; i < n_Obstaculos; ++i) {
			Console::SetCursorPosition(obstaculos[i]->getX(), obstaculos[i]->getY());
			setColor(0, 15);
			cout << obstaculos[i]->getForma();
		}
	}
	char getCelda(int x, int y) {
		if (x >= 0 && x < ANCHO && y >= 0 && y < LARGO) {
			return TABLERO[x][y];
		}
		return ' ';
	}
	void setCelda(int x, int y, char c) {
		if (x >= 0 && x < ANCHO && y >= 0 && y < LARGO) {
			TABLERO[x][y] = c;
		}
	}
	Obstaculo** getObstaculo() {
		return this->obstaculos;
	}
	int getN_Obs() {
		return this->n_Obstaculos;
	}
};

class Heroe {
protected:
	int x, y;
	int dx, dy;
	int vidas, salud;
	bool reforestar, plantar, limpiar;
	int PROGRESO;
	float tiempo;
public:
	// Constructor y Destructor
	Heroe() : x(0), y(0), dx(1), dy(1), vidas(3), reforestar(false), plantar(false), limpiar(false) {}
	Heroe(int x, int y, int dx, int dy, int vidas, int progreso, int tiempo) : x(x), y(y), dx(dx), dy(dy), vidas(vidas), PROGRESO(progreso), tiempo(tiempo), reforestar(false), plantar(false), limpiar(false) {}
	~Heroe() {}
	void mostrarContador() {
		Console::SetCursorPosition(48, 27);
		cout << setw(2) << int(tiempo);
	}
	// Movimiento
	void dibujar(int x, int y) {
		setColor(3, 15);
		Console::SetCursorPosition(x, y);	  cout << " O ";
		Console::SetCursorPosition(x, y + 1); cout << "<|>";
		Console::SetCursorPosition(x, y + 2); cout << "/ \\";
		resetColor();
	}
	void borrar(int x, int y) {
		Console::SetCursorPosition(x, y);	  cout << "   ";
		Console::SetCursorPosition(x, y + 1); cout << "   ";
		Console::SetCursorPosition(x, y + 2); cout << "   ";
	}
	void mover(char input, int n, Obstaculo** obstaculos) {
		bool valid1 = true, valid2 = true, valid3 = true, valid4 = true;

		for (int i = 0; i < n; ++i) {
			if ((x - 1 == obstaculos[i]->getX() && y == obstaculos[i]->getY()) ||
				(x - 1 == obstaculos[i]->getX() && y + 1 == obstaculos[i]->getY()) ||
				(x - 1 == obstaculos[i]->getX() && y + 2 == obstaculos[i]->getY())) {
				valid1 = false;
			}
			if ((x + 3 == obstaculos[i]->getX() && y == obstaculos[i]->getY()) ||
				(x + 3 == obstaculos[i]->getX() && y + 1 == obstaculos[i]->getY()) ||
				(x + 3 == obstaculos[i]->getX() && y + 2 == obstaculos[i]->getY())) {
				valid2 = false;
			}
			if ((y - 1 == obstaculos[i]->getY() && x == obstaculos[i]->getX()) ||
				(y - 1 == obstaculos[i]->getY() && x + 1 == obstaculos[i]->getX()) ||
				(y - 1 == obstaculos[i]->getY() && x + 2 == obstaculos[i]->getX())) {
				valid3 = false;
			}
			if ((y + 3 == obstaculos[i]->getY() && x == obstaculos[i]->getX()) ||
				(y + 3 == obstaculos[i]->getY() && x + 1 == obstaculos[i]->getX()) ||
				(y + 3 == obstaculos[i]->getY() && x + 2 == obstaculos[i]->getX())) {
				valid4 = false;
			}
		}

		if (input == 'A' && valid1 && x > 1) {
			x -= 1;
		}
		if (input == 'D' && valid2 && x < 46) {
			x += 1;
		}
		if (input == 'W' && valid3 && y > 1) {
			y -= 1;
		}
		if (input == 'S' && valid4 && y < 21) {
			y += 1;
		}

		// Actualizar las coordenadas del héroe
		setX(x);
		setY(y);
	}
	void Labores(int x, int y) {
		if (reforestar) {
			arbol(x, y);
			setReforestar(false);
		}
		if (plantar) {
			planta(x, y);
			setPlantar(false);
		}
		if (limpiar) {
			limpieza(x, y);
			setLimpiar(false);
		}
	}
	void arbol(int x, int y) {
		Console::SetCursorPosition(x, y);		cout << "  /\\";
		Console::SetCursorPosition(x, y + 1);	cout << " /  \\";
		Console::SetCursorPosition(x, y + 2);	cout << "/____\\";
		Console::SetCursorPosition(x, y + 3);	cout << "  ||";
	}
	void planta(int x, int y) {
		Console::SetCursorPosition(x, y);		cout << " /---\\";
		Console::SetCursorPosition(x, y + 1);	cout << "|     |";
		Console::SetCursorPosition(x, y + 2);	cout << " \\---/";
		Console::SetCursorPosition(x, y + 3);	cout << "  | |";
	}
	void limpieza(int x, int y) {
		Console::SetCursorPosition(x, y);		cout << "  ||";
		Console::SetCursorPosition(x, y + 1);	cout << "  ||";
		Console::SetCursorPosition(x, y + 2);	cout << " /||\\";
		Console::SetCursorPosition(x, y + 3);	cout << "//||\\\\";
	}
	void dibujarVidas() {
		Console::SetCursorPosition(6, 26); cout << "Vidas: ";
		for (int i = 0; i < vidas; ++i) {
			vida(13 + i * 6, 25);
		}
	}
	void vida(int x, int y) {
		Console::SetCursorPosition(x, y);	cout << "/-\\/-\\";
		Console::SetCursorPosition(x, y + 1); cout << "\\    /";
		Console::SetCursorPosition(x, y + 2); cout << " \\__/";
	}
	void borrarVida(int i) {
		Console::SetCursorPosition(i * 6 + 7, 25); cout << "      ";
		Console::SetCursorPosition(i * 6 + 7, 26); cout << "      ";
		Console::SetCursorPosition(i * 6 + 7, 27); cout << "      ";
	}
	void mostrarProgreso() {
		Console::SetCursorPosition(20, 28);
		cout << "Progreso:" << setw(3) << PROGRESO << "%";
	}
	void setX(int x) { this->x = x; }
	void setY(int y) { this->y = y; }
	int getX() { return x; }
	int getY() { return y; }
	float getTiempo() { return this->tiempo; }
	void setTiempo(float tiempo) { this->tiempo = tiempo; }
	int getVidas() { return vidas; }
	void setVidas(int vidas) { this->vidas = vidas; }
	int getProgreso() { return this->PROGRESO; }
	void setProgreso(int progreso) { this->PROGRESO = progreso; }
	void setReforestar(bool valor) { this->reforestar = valor; }
	void setPlantar(bool valor) { this->plantar = valor; }
	void setLimpiar(bool valor) { this->limpiar = valor; }
};

class Enemigo : public Tablero {
private:
	int x, y;
	int dx;
	char forma;
public:
	Enemigo() {}
	Enemigo(int x, int y, int dx, char forma) : x(x), y(y), dx(dx), forma(forma) {}
	~Enemigo() {}
	void dibujar() {
		Console::SetCursorPosition(x, y);
		cout << forma;
	}
	void borrar() {
		Console::SetCursorPosition(x, y);
		cout << " ";
	}
	void mover() {
		if (x <= 1 || x >= LARGO - 2) {
			dx *= -1;
		}
		x += dx;
	}
	int getX() { return this->x; }
	int getY() { return this->y; }
	char getForma() { return this->forma; }
};

class Recurso : public Tablero {
private:
	int x, y;
	int dx, dy;
	char forma;
public:
	Recurso() {}
	Recurso(int x, int y, int dx, int dy, char forma) : x(x), y(y), dx(dx), dy(dy), forma(forma) {}
	~Recurso() {}
	void dibujar() {
		Console::SetCursorPosition(x, y);
		cout << forma;
	}
	void borrar() {
		Console::SetCursorPosition(x, y);
		cout << " ";
	}
	void mover() {
		if (x <= 1 || x >= LARGO - 2) {
			dx *= -1;
		}
		if (y <= 1 || y >= ANCHO - 2) {
			dy *= -1;
		}
		x += dx;
		y += dy;
	}
	int getX() { return this->x; }
	int getY() { return this->y; }
	char getForma() { return this->forma; }
};

class Juego : Tablero, Heroe {
protected:
	// Declaraciones de los Objetos
	Heroe* heroe;
	Tablero* tablero;
	Enemigo** enemigos;
	int n_Enemigos;
	Recurso** recursos;
	int n_Recursos;

	// Posiciones X y Y
	int pos_x_E;
	int pos_y_E;
	int pos_x_R;
	int pos_y_R;
public:
	Juego() : heroe(new Heroe(24, 11, 1, 1, 5, 0, 45)), tablero(new Tablero()), n_Enemigos(randnum(5, 7)), n_Recursos(randnum(22, 25)) {
		enemigos = new Enemigo * [n_Enemigos];
		for (int i = 0; i < n_Enemigos; ++i) {
			enemigos[i] = new Enemigo(randX(), randY(), randDX(), 'X');
		}
		recursos = new Recurso * [n_Recursos];
		for (int i = 0; i < n_Recursos; ++i) {
			recursos[i] = new Recurso(randX(), randY(), randDX(), randDY(), randRecurso());
		}
	}
	~Juego() {
		delete heroe;
		delete tablero;
		for (int i = 0; i < n_Recursos; ++i) {
			delete recursos[i];
		}
		delete[] recursos;

		for (int i = 0; i < n_Enemigos; ++i) {
			delete enemigos[i];
		}
		delete[] enemigos;
	}
	void contextualizacion() {
		system("cls");
		setColor(3, 0);
		Console::SetCursorPosition(0, 10);
		cout << R"(
       En el juego "Guardian del Medio Ambiente"       
      te embarcaras en una mision para restaurar       
    y proteger el ecosistema de un mundo en peligro.   
       Tu objetivo es enfrentar a los enemigos,        
       recolectar recursos y realizar diversas         
          tareas ecologicas para devolverle            
              la salud a la naturaleza.                
)";
		system("pause>0");
		system("cls");
		resetColor();
		setColor(4, 0);
		Console::SetCursorPosition(0, 10);
		cout << R"(
         Te encontraras en un tablero lleno de         
         desafios y oportunidades. Tendras que         
        moverte por el mapa, recolectar recursos       
         valiosos y realizar acciones cruciales        
         como plantar arboles, limpiar areas y         
          reforestar. Cada uno de estos actos          
         contribuira al progreso de tu mision.         
)";
		system("pause>0");
		system("cls");
		resetColor();
		setColor(5, 0);
		Console::SetCursorPosition(0, 10);
		cout << R"(
        Sin embargo, no estaras solo. Enemigos         
        peligrosos rondan el area y trataran de        
      obstaculizar tus esfuerzos. Deberas evitar       
      estos enemigos o enfrentarlos para mantener      
       tus vidas y seguir adelante con tu mision.      
)";
		system("pause>0");
		system("cls");
		resetColor();
		setColor(6, 0);
		Console::SetCursorPosition(0, 10);
		cout << R"(
       Preparate para una aventura emocionante         
         mientras trabajar para restaurar el           
             equilibrio ecologico con                  
                'X', '~', '*' y '#'.                   
-------Buena suerte, Guardian del Medio Ambiente-------
)";
		system("pause>0");
		resetColor();
		system("cls");
		setColor(0, 15);
	}
	void mostrarCreditos() {
		system("cls");
		Console::SetCursorPosition(6, 13); cout << "Integrantes:"; setColor(5, 0);
		Console::SetCursorPosition(6, 14); cout << "- Jean Franck Loa Rojas | u20241E406"; setColor(6, 0);
		Console::SetCursorPosition(6, 15); cout << "- Juan Tintaya Quina    | u202419718"; setColor(3, 0);
		Console::SetCursorPosition(6, 16); cout << "- Joaquin Becerra Salas | u20231F717";
		resetColor();
	}
	void validacion(int progreso, int vidas, int tiempo) {
		bool end = false;
		if (progreso >= 100 || vidas <= 0 || tiempo <= 0) {
			end = true;
		}
		if (end) {
			system("cls");
			Console::SetCursorPosition(2, 11);
			if (progreso >= 100) {
				setColor(15, 10);
				cout << R"(
  ____    _    _   _    _    ____ _____ _____ 
 / ___|  / \  | \ | |  / \  / ___|_   _| ____|
| |  _  / _ \ |  \| | / _ \ \___ \ | | |  _|  
| |_| |/ ___ \| |\  |/ ___ \ ___) || | | |___ 
 \____/_/   \_\_| \_/_/   \_\____/ |_| |_____|
)";
			}
			else if (vidas <= 0 || tiempo <= 0) {
				setColor(15, 12);
				cout << R"(
 ____  _____ ____  ____ ___ ____ _____ _____ 
|  _ \| ____|  _ \|  _ \_ _/ ___|_   _| ____|
| |_) |  _| | |_) | | | | |\___ \ | | |  _|  
|  __/| |___|  _ <| |_| | | ___) || | | |___ 
|_|   |_____|_| \_\____/___|____/ |_| |_____|
)";
			}
			_sleep(3000);
			resetColor();
			mostrarCreditos();
			setColor(0, 0);
			exit(0);
		}
	}
	void Introduccion() {
		setColor(0, 15);
		Console::SetCursorPosition(8, 5);
		cout << R"(
  ____  _                           _    _        
 |  _ \(_)                         (_)  | |       
 | |_)| _  ___ _ __ __  _____ _ __  _  _| | ___   
 |  _ <| |/ _ \ '_  \ \/ / _ \ '_ `| |/ _ |/ _ \  
 | |_)|| |  __/ | | |\  /  __/ | | | | (_|| (_) | 
 |____/|_|\___|_| |_| \/ \___|_| |_|_|\___|\___/  
                      __ _                        
      X              / _` |             ~         
                    | (_| |                       
      O              \__,_|               *       
     <|>        ____ __  __    _                  
     / \       / ___|  \/  |  / \       #         
              | |  _| |\/| | / _ \                
              | |_| | |  | |/ ___ \               
               \____|_|  |_/_/   \_\              

)";
		resetColor();
	}
	void colisionRecursos() {
		int heroeX = heroe->getX();
		int heroeY = heroe->getY();

		for (int i = 0; i < n_Recursos - 1; ++i) {
			for (int dx = 0; dx <= 2; ++dx) {
				for (int dy = 0; dy <= 2; ++dy) {
					if (recursos[i]->getX() == heroeX + dx && recursos[i]->getY() == heroeY + dy) {
						if (recursos[i]->getForma() == '~') {
							heroe->setPlantar(true);
						}
						else if (recursos[i]->getForma() == '*') {
							heroe->setReforestar(true);
						}
						else if (recursos[i]->getForma() == '#') {
							heroe->setLimpiar(true);
						}
						heroe->Labores(recursos[i]->getX(), recursos[i]->getY());
						heroe->setProgreso(heroe->getProgreso() + 5);
						recursos[i]->borrar();
						eliminarRecurso(i);
						break;
					}
				}
			}
		}
	}
	void colisionEnemigos() {
		int heroeX = heroe->getX();
		int heroeY = heroe->getY();

		for (int i = 0; i < n_Enemigos; ++i) {
			for (int dx = 0; dx <= 2; ++dx) {
				for (int dy = 0; dy <= 2; ++dy) {
					if (enemigos[i]->getX() == heroeX + dx && enemigos[i]->getY() == heroeY + dy) {
						heroe->borrarVida(heroe->getVidas());
						heroe->setVidas(heroe->getVidas() - 1);
					}
				}
			}
		}
	}
	void moverEnemigos() {
		for (int i = 0; i < n_Enemigos; ++i) {
			setColor(12, 15);
			enemigos[i]->borrar();
			enemigos[i]->mover();
			enemigos[i]->dibujar();
			resetColor();
		}
	}
	void moverRecursos() {
		for (int i = 0; i < n_Recursos; ++i) {
			setColor(8, 15);
			recursos[i]->borrar();
			recursos[i]->mover();
			recursos[i]->dibujar();
			resetColor();
		}
	}
	void eliminarRecurso(int indice) {
		delete recursos[indice];
		for (int i = indice; i < n_Recursos - 1; ++i) {
			recursos[i] = recursos[i + 1];
		}
		--n_Recursos;
		Recurso** copia = new Recurso * [n_Recursos];
		for (int i = 0; i < n_Recursos; ++i) {
			copia[i] = recursos[i];
		}
		delete[] recursos;
		recursos = copia;
	}
	void iniciarJuego() {
		contextualizacion();
		char input;
		int prevx;
		int prevy;
		tablero->DIBUJAR_MAPA();
		while (true) {
			tablero->DIBUJAR_OBSTACULOS();
			moverRecursos();
			moverEnemigos();

			prevx = heroe->getX();
			prevy = heroe->getY();
			heroe->borrar(prevx, prevy);

			if (_kbhit()) {
				input = toupper(_getch());
				heroe->mover(input, tablero->getN_Obs(), tablero->getObstaculo());
			}

			heroe->dibujar(heroe->getX(), heroe->getY());
			colisionRecursos();
			colisionEnemigos();
			heroe->dibujarVidas();
			heroe->mostrarProgreso();
			_sleep(50);
			validacion(heroe->getProgreso(), heroe->getVidas(), heroe->getTiempo());
			heroe->mostrarContador();
			heroe->setTiempo(heroe->getTiempo() - 0.07);
		}
	}
};

void printMenu(int selected = 0) {
	const string options[] = { "1. Jugar", "2. Mostrar creditos", "3. Salir" };
	const int numOptions = sizeof(options) / sizeof(options[0]);

	system("cls");

	for (int i = 0; i < numOptions; ++i) {
		Console::SetCursorPosition(15, 13 + i);

		if (i == selected) {
			setColor(12, 0);
			cout << "-> ";
			resetColor();
			cout << options[i] << endl;
		}
		else {
			cout << "   " << options[i] << endl;
		}
	}
}

void Menu(Juego* ObjJuego) {
	int selected = 0;
	const int numOptions = 3;
	char input;

	while (true) {
		printMenu(selected);

		input = toupper(_getch());

		switch (input) {
		case 'W':
			selected = (selected - 1 + numOptions) % numOptions;
			break;
		case 'S':
			selected = (selected + 1) % numOptions;
			break;
		case '\r':
			switch (selected) {
			case 0:
				ObjJuego->iniciarJuego();
				break;
			case 1:
				ObjJuego->mostrarCreditos();
				break;
			case 2:
				cout << "Saliendo..." << endl;
				exit(0);
				break;
			}
			system("pause>0");
			break;
		default:
			cout << "Usa [W/S] para navegar y [Enter] para seleccionar." << endl;
			system("pause");
			break;
		}
	}
}

void UPClogo(int x, int y) {
	system("cls");
	Console::SetCursorPosition(x, y);
	const int height = 20;
	const int width = 40;
	int UPC[height][width] = {
		{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
		{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
		{2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,2,2},
		{2,2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,2,2},
		{2,2,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,2,2},
		{2,2,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,2,2},
		{2,2,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,2,2},
		{2,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,2,2},
		{2,2,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,2,2},
		{2,2,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,2,2},
		{2,2,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2},
		{2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2},
		{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},
		{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2},

	};
	for (int i = 0; i < height; i++) {
		for (int j = 0; j < width; ++j) {
			if (UPC[i][j] == 0) {
				setColor(15, 15);
				cout << "#";
			}
			if (UPC[i][j] == 1) {
				setColor(4, 4);
				cout << "#";
			}
			if (UPC[i][j] == 2) {
				setColor(8, 8);
				cout << "#";
			}
		}
		Console::SetCursorPosition(x, y++);
	}
	resetColor();
	Console::SetCursorPosition(x += 8, y++);
	cout << "-Exigete, Innova, UPC-";
	Sleep(3000);
	Console::SetCursorPosition(0, 0);
	system("cls");
	resetColor();
}

void TrabajoParcial() {
	hidecursor();
	Juego* ObjJuego = new Juego();
	UPClogo(4, 5);
	ObjJuego->Introduccion();
	_sleep(3000);
	Menu(ObjJuego);
	delete ObjJuego;
}

int main() {
	srand(time(0));
	TrabajoParcial();
	return 0;
}
Número de obstáculos
    for (int i = 0; i < numObstacles; ++i) {
        int obsX, obsY;
        do {
            obsX = rand() % (width - 2) + 1; // Generar coordenada X aleatoria dentro del tablero
            obsY = rand() % (height - 2) + 1; // Generar coordenada Y aleatoria dentro del tablero
            validPosition = true;
            // Verificar que la posición no sea la inicial del muñeco O
            if (obsX == posX && obsY == posY) {
                validPosition = false;
            }
            else { // Verificar con
                for (int j = 0; j < numCharacters; ++j) {
                    if ((obsX == posXChars_H[j] && obsY == posYChars_H[j]) ||
                        (obsX == posXChars_V[j] && obsY == posYChars_V[j])) {
                        validPosition = false;
                        break;
                    }
                }
            }
        } while (!validPosition || board[obsY][obsX] != ' '); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
        board[obsY][obsX] = '#'; // Carácter para el obstáculo
    }
}

void BoardValidation3() {
    // Inicializamos el tablero con espacios en blanco y bordes
    for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
            // Dibujar bordes
            if (i == 0 || i == height - 1 || j == 0 || j == width - 1)
                board[i][j] = '#'; // Carácter para el borde
            else
                board[i][j] = ' '; // Espacio en blanco para el interior
        }
    }
    // Añadir obstáculos al tablero
    srand(time(0));
    int numObstacles = 300; // Número de obstáculos
    for (int i = 0; i < numObstacles; ++i) {
        int obsX, obsY;
        do {
            obsX = rand() % (width - 2) + 1; // Generar coordenada X aleatoria dentro del tablero
            obsY = rand() % (height - 2) + 1; // Generar coordenada Y aleatoria dentro del tablero
            validPosition = true;
            // Verificar que la posición no sea la inicial del muñeco O
            if (obsX == posX && obsY == posY) {
                validPosition = false;
            }
            else { // Verificar con
                for (int j = 0; j < numCharacters; ++j) {
                    if (obsX == posXChars_U[j] && obsY == posYChars_U[j]) {
                        validPosition = false;
                        break;
                    }
                }
            }
        } while (!validPosition || board[obsY][obsX] != ' '); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
        board[obsY][obsX] = '#'; // Carácter para el obstáculo
    }
}

/*
Validacion de Personajes
*/
void CharactersValidation1() {
    for (int i = 0; i < numCharacters; ++i) {
        bool validPosition = false;
        do {
            // Generar coordenadas aleatorias dentro del tablero
            posXChars_A[i] = randnum(1, width - 2);
            posYChars_A[i] = randnum(1, height - 2);
            posXChars_X[i] = randnum(1, width - 2);
            posYChars_X[i] = randnum(1, height - 2);
            posXChars_W[i] = randnum(1, width - 2);
            posYChars_W[i] = randnum(1, height - 2);
            posXChars_K[i] = randnum(1, width - 2);
            posYChars_K[i] = randnum(1, height - 2);

            // Verificar que la posición no sea una ocupada
            if ((posXChars_A[i] != posXChars_X[i] || posYChars_A[i] != posYChars_X[i]) &&
                (posXChars_A[i] != posXChars_W[i] || posYChars_A[i] != posYChars_W[i]) &&
                (posXChars_A[i] != posXChars_K[i] || posYChars_A[i] != posYChars_K[i]) &&
                (posXChars_X[i] != posXChars_W[i] || posYChars_X[i] != posYChars_W[i]) &&
                (posXChars_X[i] != posXChars_K[i] || posYChars_X[i] != posYChars_K[i]) &&
                (posXChars_W[i] != posXChars_K[i] || posYChars_W[i] != posYChars_K[i]) &&
                board[posYChars_A[i]][posXChars_A[i]] == ' ' &&
                board[posYChars_X[i]][posXChars_X[i]] == ' ' &&
                board[posYChars_W[i]][posXChars_W[i]] == ' ' &&
                board[posYChars_K[i]][posXChars_K[i]] == ' ') {
                validPosition = true;
            }
            else {
                validPosition = false;
            }
        } while (!validPosition); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
    }
}

void CharactersValidation2() {
    for (int i = 0; i < numCharacters; ++i) {
        bool validPosition = false;
        do {
            // Generar coordenadas aleatorias dentro del tablero
            posXChars_H[i] = randnum(1, width - 2);
            posYChars_H[i] = randnum(1, height - 2);
            posXChars_V[i] = randnum(1, width - 2);
            posYChars_V[i] = randnum(1, height - 2);

            // Verificar que la posición no sea una ocupada
            if ((posXChars_H[i] != posXChars_V[i] || posYChars_H[i] != posYChars_V[i]) &&
                board[posYChars_H[i]][posXChars_H[i]] == ' ' &&
                board[posYChars_V[i]][posXChars_V[i]] == ' ') {
                validPosition = true;
            }
            else {
                validPosition = false;
            }
        } while (!validPosition); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
    }
}

void CharactersValidation3() {
    for (int i = 0; i < numCharacters; ++i) {
        bool validPosition = false;
        do {
            // Generar coordenadas aleatorias dentro del tablero
            posXChars_U[i] = randnum(1, width - 2);
            posYChars_U[i] = randnum(1, height - 2);

            // Verificar que la posición no sea una ocupada
            if (board[posYChars_U[i]][posXChars_U[i]] == ' ') {
                validPosition = true;
            }
            else {
                validPosition = false;
            }
        } while (!validPosition); // Asegurarse de que el obstáculo no se coloque sobre otro obstáculo o muñeco
    }
}

int Level = 0; // Nivel
float Calification = 0; // Calificacion del Jugador

/*
Juego 1
*/
void GamePlay1() {
    while (Points < 100 && Points > 0) {
        // Dibujar personajes en el tablero
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_A[i]][posXChars_A[i]] = A;
            board[posYChars_X[i]][posXChars_X[i]] = X;
            board[posYChars_W[i]][posXChars_W[i]] = W;
            board[posYChars_K[i]][posXChars_K[i]] = K;
        }
        board[posY][posX] = O; // Dibujar el personaje principal
        clearScreen();
        setColor(6, 0);
        PuntajeHeroe(1, 26, Points);
        NumVisitsTutor(1, 27, TutorVisits);
        NumVisitsEnemy(1, 28, EnemyVisits);
        Hero(Level, 70, 27, Name);
        setColor(0, 3);
        // Imprimimos el tablero
        for (int i = 0; i < height; ++i) {
            for (int j = 0; j < width; ++j) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
        resetColor();

        board[posY][posX] = ' '; // Limpiamos la posición actual de Heroe

        // Limpiamos las posiciones anteriores de los muñecos
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_A[i]][posXChars_A[i]] = ' ';
            board[posYChars_X[i]][posXChars_X[i]] = ' ';
            board[posYChars_W[i]][posXChars_W[i]] = ' ';
            board[posYChars_K[i]][posXChars_K[i]] = ' ';
        }

        // Capturamos la entrada
        char input = toupper(_getch());

        // Movemos al muñeco O según la entrada, asegurándonos de no colisionar con los bordes ni con los obstáculos
        switch (input) {
        case 'W':
            if (posY > 1 && board[posY - 1][posX] == ' ') posY--; // Mover arriba si no está en el borde superior o hay un obstáculo
            break;
        case 'A':
            if (posX > 1 && board[posY][posX - 1] == ' ') posX--; // Mover izquierda si no está en el borde izquierdo o hay un obstáculo
            break;
        case 'S':
            if (posY < height - 2 && board[posY + 1][posX] == ' ') posY++; // Mover abajo si no está en el borde inferior o hay un obstáculo
            break;
        case 'D':
            if (posX < width - 2 && board[posY][posX + 1] == ' ') posX++; // Mover derecha si no está en el borde derecho o hay un obstáculo
            break;
        }
        // Mover personajes
        moveCharacters(board, posYChars_A, posXChars_A);
        moveCharacters(board, posYChars_X, posXChars_X);
        moveCharacters(board, posYChars_W, posXChars_W);
        moveCharacters(board, posYChars_K, posXChars_K);

        // Verificar si el muñeco O está en la posición de algún muñeco A, X, W o K para mostrar tutoriales
        for (int i = 0; i < numCharacters; ++i) {
            if (posX == posXChars_A[i] && posY == posYChars_A[i]) {
                showPythagorasTutorial_A(); // Mostrar Tutorial de Pitagoras al colisionar
                TutorVisits++; Points -= 2;
            }
            if (posX == posXChars_X[i] && posY == posYChars_X[i]) {
                showEquationsTutorial_X(); // Mostrar Tutorial de Ecuaciones al colisionar
                TutorVisits++; Points -= 2;
            }
            if (posX == posXChars_W[i] && posY == posYChars_W[i]) {
                showPythagorasChallenge_W(); // Mostrar Desafio de Pitagoras al colisionar
                EnemyVisits++;
            }
            if (posX == posXChars_K[i] && posY == posYChars_K[i]) {
                showEquationsChallenge_K(); // Mostrar Desafio de Ecuaciones al colisionar
                EnemyVisits++;
            }
        }
    }
    if (Points <= 0) {
        Calification = 0;
        postCredits(Name, Level, 39, 7, Calification, TutorVisits, EnemyVisits); // Mostrar creditos si el Heroe tiene como Puntaje 0
        exit(0);
    }
    else if (Points >= 100) {
        Calification += Points / 100;
        Level++;
        Points = 99;
    }
}

/*
Juego 2
*/
void GamePlay2() {
    while (Points < 100 && Points > 0) {
        // Dibujar personajes en el tablero
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_H[i]][posXChars_H[i]] = H;
            board[posYChars_V[i]][posXChars_V[i]] = V;
        }
        board[posY][posX] = O; // Dibujar el personaje principal

        clearScreen();
        setColor(15, 0);
        PuntajeHeroe(1, 26, Points);
        NumVisitsTutor(1, 27, TutorVisits);
        NumVisitsEnemy(1, 28, EnemyVisits);
        Hero(Level, 70, 27, Name);
        setColor(5, 14);
        // Imprimimos el tablero
        for (int i = 0; i < height; ++i) {
            for (int j = 0; j < width; ++j) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
        resetColor(); // Restaurar el color

        board[posY][posX] = ' '; // Limpiamos la posición actual de Heroe

        // Limpiamos las posiciones anteriores de los muñecos
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_H[i]][posXChars_H[i]] = ' ';
            board[posYChars_V[i]][posXChars_V[i]] = ' ';
        }

        // Capturamos la entrada
        char input = toupper(_getch());

        // Movemos al muñeco O según la entrada, asegurándonos de no colisionar con los bordes ni con los obstáculos
        switch (input) {
        case 'W':
            if (posY > 1 && board[posY - 1][posX] == ' ') posY--; // Mover arriba si no está en el borde superior o hay un obstáculo
            break;
        case 'A':
            if (posX > 1 && board[posY][posX - 1] == ' ') posX--; // Mover izquierda si no está en el borde izquierdo o hay un obstáculo
            break;
        case 'S':
            if (posY < height - 2 && board[posY + 1][posX] == ' ') posY++; // Mover abajo si no está en el borde inferior o hay un obstáculo
            break;
        case 'D':
            if (posX < width - 2 && board[posY][posX + 1] == ' ') posX++; // Mover derecha si no está en el borde derecho o hay un obstáculo
            break;
        }

        // Mover personajes
        moveCharacters(board, posYChars_H, posXChars_H);
        moveCharacters(board, posYChars_V, posXChars_V);

        // Verificar si el muñeco O está en la posición de algún muñeco A, X, W o K para mostrar tutoriales
        for (int i = 0; i < numCharacters; ++i) {
            if (posX == posXChars_H[i] && posY == posYChars_H[i]) {
                showTutorial_H(); Points -= 2; // Mostrar Tutorial al colisionar
                TutorVisits++;
            }
            if (posX == posXChars_V[i] && posY == posYChars_V[i]) {
                showChallenge_V(); // Mostrar Desafio al colisionar
                EnemyVisits++;
            }
        }
    }
    if (Points <= 0) {
        postCredits(Name, Level, 39, 7, Calification, TutorVisits, EnemyVisits); // Mostrar creditos si el Heroe tiene como Puntaje 0
        exit(0);
    }
    else if (Points >= 100) {
        Calification += Points / 100;
        Level++;
        Points = 99;
    }
}

/*
Juego 3
*/
void GamePlay3() {
    resetColor();
    while (Points < 100 && Points > 0) {
        // Dibujar personajes en el tablero
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_U[i]][posXChars_U[i]] = U;
        }
        board[posY][posX] = O; // Dibujar el personaje principal

        clearScreen();
        setColor(15, 0);
        PuntajeHeroe(1, 26, Points);
        NumVisitsTutor(1, 27, TutorVisits);
        NumVisitsEnemy(1, 28, EnemyVisits);
        Hero(Level, 70, 27, Name);
        setColor(12, 15);
        // Imprimimos el tablero
        for (int i = 0; i < height; ++i) {
            for (int j = 0; j < width; ++j) {
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
        resetColor(); // Restablecer el color después de imprimir el tablero

        board[posY][posX] = ' '; // Limpiamos la posición actual de Heroe

        // Limpiamos las posiciones anteriores de los muñecos
        for (int i = 0; i < numCharacters; ++i) {
            board[posYChars_U[i]][posXChars_U[i]] = ' ';
        }

        // Capturamos la entrada
        char input = toupper(_getch());

        // Movemos al muñeco O según la entrada, asegurándonos de no colisionar con los bordes ni con los obstáculos
        switch (input) {
        case 'W':
            if (posY > 1 && board[posY - 1][posX] == ' ') posY--; // Mover arriba si no está en el borde superior o hay un obstáculo
            break;
        case 'A':
            if (posX > 1 && board[posY][posX - 1] == ' ') posX--; // Mover izquierda si no está en el borde izquierdo o hay un obstáculo
            break;
        case 'S':
            if (posY < height - 2 && board[posY + 1][posX] == ' ') posY++; // Mover abajo si no está en el borde inferior o hay un obstáculo
            break;
        case 'D':
            if (posX < width - 2 && board[posY][posX + 1] == ' ') posX++; // Mover derecha si no está en el borde derecho o hay un obstáculo
            break;
        }

        // Mover personajes
        moveCharacters(board, posYChars_U, posXChars_U);

        // Verificar si el muñeco O está en la posición de algún muñeco A, X, W o K para mostrar tutoriales
        for (int i = 0; i < numCharacters; ++i) {
            if (posX == posXChars_U[i] && posY == posYChars_U[i]) {
                showFinalChallenge_U(); // Mostrar Desafio Final
                EnemyVisits++;
            }
        }
    }
    if (Points <= 0) {
        postCredits(Name, Level, 39, 7, Calification, TutorVisits, EnemyVisits); // Mostrar creditos si el Heroe tiene como Puntaje 0
        exit(0);
    }
    if (Points >= 100) {
        Calification += Points / 100;
        Level++;
        postCredits(Name, Level, 39, 7, Calification, TutorVisits, EnemyVisits); // Mensaje Ganador
    }
}

/*
Función del Juego
*/
void MathWorld() {
    Presentacion(28, 5);             // Presentacion
    hideCursor();                    // Ocultar el cursor
    srand(time(0));                  // Semilla para los números aleatorios
    UPClogo(40, 4);                  // Logo de UPC hecho manualmente 
    Welcome();                       // Bienvenida
    cout << "Ingresa tu nombre: ";
    cin >> Name; 
    Menu();                          // Menu
    LogoIntroduction();              // Logo de la Introduccion
    Instructions1();                 // Primera Instruccion
    Instructions2(28, 5);            // Segunda Instruccion
    GameModel();                     // Contextualización
    
    /*
    Juego
    */

    BoardValidation1();              // Validacion del Tablero
    CharactersValidation1();         // Validacion de los Personajes
    Transition(10, 5, Level);        // Transición
    GamePlay1();                     // Juego 1
    BoardValidation2();              // Validacion del Tablero
    CharactersValidation2();         // Validacion de los Personajes
    Transition(10, 5, Level);        // Transición
    GamePlay2();                     // Juego 2
    BoardValidation3();              // Validacion del Tablero
    CharactersValidation3();         // Validacion de los Personajes
    Transition(10, 5, Level);        // Transición
    GamePlay3();                     // Juego 3
    Gratitude(15, 7);                // Despedida
    UPClogo(40, 4);                  // Logo de UPC hecho manualmente
}

/*
Funcion Principal
*/
int main() {
    MathWorld(); // Llamamos al Juego
    return 0;
}
