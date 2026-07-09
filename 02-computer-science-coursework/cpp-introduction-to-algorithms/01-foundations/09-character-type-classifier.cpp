#include <iostream>
#include <string>

using namespace std;

int main() {
    string verificacion;
    char n;
    cout << "Ingresa el valor: ";
    cin >> n;
    verificacion = (n <= '9' && n >= '1') ? "Es un digito" :
                   (n <= 'Z' && n >= 'A') ? "Es una mayuscula" :
                   (n <= 'z' && n >= 'a') ? "Es una minuscula" :
                   "Es un caracter especial";
    cout << verificacion;

    return 0;
}
