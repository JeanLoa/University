#include "pch.h"
#include <iostream>
#include <conio.h>
#include <windows.h>

using namespace std;
using namespace System;
void setColor(int textColor, int bgColor) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}
void resetColor() {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, 7);
}
void lineasdeNazca() {
	setColor(0,15);
	cout << R"(                                                                                                                     
                                                                                                                     
                       .:++=-:...:-++=:                                                                              
                   .---.   ...:::...  ..--:                                                                          
                ..+: ..:+=....... ..-+-.. .=-.                                                                       
               .=. .=-..:==::---:-=-. ..--...=.                                                                      
             .-- .-: :=:..::--=--:...--...=:  -:                                                                     
             -: ::..+..:=:..-===-..:=..:=  .-..=                                                                     
           .=: .-.:- :=.:=:..::::.:=::=..=..-: .-                                                                    
           -. .*..+ .=.+..+: .::..=..=.=..- .# .#                                                                    
          .-..-..+..+.-.=:.=-:::.:-:=.+.* :: :. =.                                                                   
          .- .= .=.=.-::-.-:+...-:-.:.::-..# :..=.                                                                   
          -: .: ::.= -.::::+.:.==--.:.:::..#.=..#                                                                    
          =. :: .=.=.-::-:--:--.:-:--.+.* ::.* .-                                                                    
          =. .: .+.:=.=.= -:.=+--==.:-.=..=.-..+.                                                                    
          -: .=  := -:.=.=-.=-:..:-=..=:.=..-.:-                                                                     
          .-  -.  :- -:.=..=+..   .:+:.:= .* .*                                                                      
          .-. .=. .-- .=..=-....... .=-..=:.:-                                        ..::..                         
           :-  .-.  .=. .*:..:****=...:=...-:                  ..::=*=--+-:.       .:=.    .+..                      
            :=  .::. ..-: ..::-+*+-::. ..+:                  .=::.        .-:.   ..=.       .::.                     
             .:.  .-:.  .-=-:.......:-=-.                ..=-     .:--+=-:. .=...=..          ::.                    
              .+.   .=-     .........                  .:=.    .-+...    .-=...+.*.           ..+.                   
               .:=.    .-=..                         .--    .-=.           .--..-==.          .-:                    
                  :=..    .-*....                  .+.   ..=:                .--.             -=..                   
                    :=:       .-::++:..          .=-.   .-.                    .-.          .....--.                 
                       :=:..          .=-:.    .:-.     .:.                   .:=.....    ..=..=:. .=..              
                         .:+-.           .-=..:=.  ...   .+.                .--. .=:.:*..:=:.  ..-:..:+.             
                             .-=--..        ..  ..-=..-.   -:             .--...=..               .+:..=:.           
                                   ..+%+. .     .=    .*    -.           .*...*.                    .=. .=.          
                                       .* :.-.  .-.    .--.  :-.       .-:..+:.                      .=..-:          
                                       .-.=. =.  :.      ::  .=:       .=..-.                         .-..=.         
                                       :..+  .+. .*       .=  .-:     .+..+.                          .=..+.         
                                      .-..+   ::  -.       -:   -.    .=..=.                          .=..+.         
                                      .=..-   .:  .#       .*   -:     .=.=.                 ....     .=.:-.         
                                      .=..:   .=.  :.       :.  .:     .-..-.            ..-=::.:=.  .-:.-.          
                                      .-.::    .*. .:       .*  .-       =..:-.          :=#....*.+.-=.:=.           
                                      .:.::     .=..-.      .#  .:        :-.:=.         .+*=:--. ....=.             
                                      .-.--     .:. .@      .*  -:         .+..-:      ...=#*+-:.   .+.              
                                      .= -:     .-. .%      :. .+.          .-:..-....--=......:-=..-:               
                                      := :.     .-..:.     .+ .=.             .=..:-:::-.:-*..-=.-+.-.               
                                      :: :.   ..+. .-      -:.+.               :-   ..::.=+..:-:...*-.               
                                      :..-. .+..   .=.   .=:.::.               .-:  ..:--=:...     ...               
                                     .=..+  .=..   ..:+.:=.  =-...              ..=..-..:-=**=.                      
                                     .* .+   .:=. ..-+-:.    .=-:.                ..--++:                            
                                     .* .=     ..=:+::.:==:.+++-=.                                                   
                                     .- ::       ....    ...:+=..                                                    
                                     :. -.                                                                           
                                    .=..+.                                                                           
                                    .+ .#                                                                            
                                    .+ .*                                                                            
                                    .+..-                                                                            
                                     ....                                                                            
)";
	resetColor();
}
void avion(int num, int x, int y) {
	switch (num) {
	case 1:
		Console::SetCursorPosition(x, y);     cout << "-----------";
		Console::SetCursorPosition(x, y + 1); cout << "_\\__(_)__/_";
		Console::SetCursorPosition(x, y + 2); cout << "   ./ \\.   ";
		break;
	case 2:
		Console::SetCursorPosition(x, y);     cout << "________|________";
		Console::SetCursorPosition(x, y + 1); cout << " _|_____0_____|_ ";
		Console::SetCursorPosition(x, y + 2); cout << "       | |       ";
		break;
	case 3:
		Console::SetCursorPosition(x, y);     cout << "       __|__       ";
		Console::SetCursorPosition(x, y + 1); cout << "________(*)________";
		Console::SetCursorPosition(x, y + 2); cout << "       o/ \\o       ";
		break;
	case 4:
		Console::SetCursorPosition(x, y);     cout << "    __!__    ";
		Console::SetCursorPosition(x, y + 1); cout << "_____(_)_____";
		Console::SetCursorPosition(x, y + 2); cout << "    ! ! !    ";
		break;
	case 5:
		Console::SetCursorPosition(x, y);     cout << "    __!__    ";
		Console::SetCursorPosition(x, y + 1); cout << "-----<*>-----";
		Console::SetCursorPosition(x, y + 2); cout << "    o O o    ";
		break;
	case 6:
		Console::SetCursorPosition(x, y);     cout << "        .        ";
		Console::SetCursorPosition(x, y + 1); cout << "._______|_______.";
		Console::SetCursorPosition(x, y + 2); cout << "      \\(*)/      ";
		break;
	case 7:
		Console::SetCursorPosition(x, y);     cout << "   |   ";
		Console::SetCursorPosition(x, y + 1); cout << "--=O=--";
		break;
	case 8:
		Console::SetCursorPosition(x, y);     cout << "      \\ . /      ";
		Console::SetCursorPosition(x, y + 1); cout << ".______(*)______.";
		break;
	case 9:
		Console::SetCursorPosition(x, y);     cout << "   ____       _ ";
		Console::SetCursorPosition(x, y + 1); cout << "| __\\_\\_o____/_|";
		Console::SetCursorPosition(x, y + 2); cout << "<[___\\_\\_-----< ";
		Console::SetCursorPosition(x, y + 3); cout << "|               ";
		break;
	}
}
class Avion {
private:
	int x, y;
	int num;
	int color;
public:
	Avion(){}
	Avion(int x, int y, int num, int color): x(x), y(y), num(num), color(color){}
	~Avion(){}
	void dibujar(int x, int y) {
		Console::SetCursorPosition(x, y);
		setColor(color, 15);
		avion(num, x, y);
		resetColor();
	}
	void borrar(int x, int y) {
		Console::SetCursorPosition(x, y);    cout << "                 ";
		Console::SetCursorPosition(x, y+1);  cout << "                 ";
		Console::SetCursorPosition(x, y+2);  cout << "                 ";
		Console::SetCursorPosition(x, y+3);  cout << "                 ";
	}
	void mover(char input) {
		input = toupper(_getch());
		if (input == 'W' && y > 1) --y;
		if (input == 'S' && y < 28) ++y;
		if (input == 'A' && x > 1) --x;
		if (input == 'D' && x < 118) ++x;
		setX(x);
		setY(y);
		if (input == 'Q') {
			system("cls");
			cout << "La expedicion ha sido concluida";
			exit(0);
		}
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
class Vuelo : public Avion {
public:
	Vuelo(int x, int y, int num, int color) : Avion(x, y, num, color) {	}
	~Vuelo(){}
	void iniciarViaje() {
		while (true) {
			system("cls");
			lineasdeNazca();
			Console::SetCursorPosition(70, 25);
			cout << "Presione Q para finalizar la expedicion";
			int prevx = getX();
			int prevy = getY();
			char input = 0;
			dibujar(getX(), getY());
			mover(input);
			borrar(prevx, prevy);
		}
	}
};

int main() {
	Console::CursorVisible = false;
	int num, color;
	do {
		setColor(0, 15);
		cout << R"(
1. -----------     2. ________|________     3.      __|__           4.     __!__        
   _\__(_)__/_         _|_____0_____|_       ________(*)________       _____(_)_____    
      ./ \.                  | |                    o/ \o                  ! ! !        
----------------------------------------------------------------------------------------
5.    __!__        6.        .              7.     |                8.       \ . /      
  -----<*>-----      ._______|_______.          --=O=--                .______(*)______.
      o O o                \(*)/                                                        
----------------------------------------------------------------------------------------
                                                                                        
                                  9.   ____       _                                     
                                    | __\_\_o____/_|                                    
                                    <[___\_\_-----<                                     
                                    |                                                   
)";
		resetColor();
		cout << "\nIngrese que avion desea para el viaje: ";
		cin >> num;
		system("cls");
		cout << "Ingrese que color deseas para tu avion:\n";
		cout << "0: Negro, 1: Azul, 2: Verde, 3: Celeste, 4: Rojo, 5: Magenta, 6: Amarilo, 7: Blanco\n";
		cin >> color;
		system("cls");
	} while ((num > 9 || num < 1) && (color > 7 || color < 0));
	Vuelo* ObjVuelo = new Vuelo(5, 5, num, color);
	ObjVuelo->iniciarViaje();
	return 0;
}
