set PATH_ENVIROMENT="C:\Datos\Lucas Ibaniez\Proyectos\entorno\ve_anaconda"

set PATH_PROJECT="C:\Datos\Lucas Ibaniez\Proyectos\infovis_tp\notebooks"

start cmd  /k "cd /d %PATH_ENVIROMENT%/Scripts/ & activate & cd /d %PATH_PROJECT% & jupyter-lab"
