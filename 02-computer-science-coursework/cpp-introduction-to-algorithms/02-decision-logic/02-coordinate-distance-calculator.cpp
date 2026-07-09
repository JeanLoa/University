#include <iostream>

using namespace std;

int main() {
    int x1, y1, x2, y2;
    cout << "Ingrese la coordenada x1: ";
    cin >> x1;
    cout << "Ingrese la coordenada y1: ";
    cin >> y1;
    cout << "Ingrese la coordenada x2: ";
    cin >> x2;
    cout << "Ingrese la coordenada y2: ";
    cin >> y2;

    float distancia = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));

    cout << "La distancia entre estos 2 puntos: " << distancia;

    return 0;
}
