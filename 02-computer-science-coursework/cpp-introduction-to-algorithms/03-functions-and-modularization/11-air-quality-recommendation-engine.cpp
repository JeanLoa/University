#include <iostream>

using namespace std;

string Recomendacion(int AQILevel, int PM2_5) {
	string Recomendacion = ((AQILevel >= 0 && AQILevel < 51) && (PM2_5 >= 0 && PM2_5 < 12.1)) ? "Air quality is satisfactory and posees little or no risk." :
		((AQILevel >= 51 && AQILevel < 101) && (PM2_5 >= 12.1 && PM2_5 < 35.4)) ? "Sensitive individuals should avoid outdoor activity as they may experience respiratory symptoms." :
		((AQILevel >= 0 && AQILevel < 51) && (PM2_5 >= 0 && PM2_5 < 12.1)) ? "General public and sensitive individuals in particular are at risk to experience irritation and respiratory problems." :
		((AQILevel >= 0 && AQILevel < 51) && (PM2_5 >= 0 && PM2_5 < 12.1)) ? "Increased likelihood of adverse effects and agravation to the heart and lungs among general public." :
		((AQILevel >= 0 && AQILevel < 51) && (PM2_5 >= 0 && PM2_5 < 12.1)) ? "General public will be noticeably affected. Sensitive groups should restrict outdoor activities." :
		"General public at high risk of experiencing strong irritations and adverse health respects. Should avoid outdoor activities.";
	return Recomendacion;
}

int main() {
	int AQILevel, PM2_5;
	cout << "Ingrese el AQI Level: ";
	cin >> AQILevel;
	cout << "Ingrese el PM2_5: ";
	cin >> PM2_5;

	string Consejo = Recomendacion(AQILevel, PM2_5);

	cout << "La recomendacion por parte de Health Recommendation:\n" << Consejo;

	return 0;
}
