# Leaflet Start

## Leaflet

### Install
```
npm i leaflet --save
npm i @types/leaflet --save-dev
```

#### angular.json  
"projects" > プロジェクト名 > "architect" > "build" > "options" に以下を追加
- "assets"
    ```
    {
        "glob": "**/*",
        "input": "./node_modules/leaflet/dist/images",
        "output": "./assets/leaflet"
    }
    ```

- "styles"
    ```
    "./node_modules/leaflet/dist/leaflet.css"
    ```

