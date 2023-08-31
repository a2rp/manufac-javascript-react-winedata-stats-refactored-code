import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { wineDataSet } from "./files/wineDataSet";

function App() {
    const [alcoholClass, setAlcoholClass] = useState([]);

    const [flavanoidsMean, setFlavanoidsMean] = useState([]);
    const [flavanoidsMedian, setFlavanoidsMedian] = useState([]);
    const [flavanoidsMode, setFlavanoidsMode] = useState([]);

    const [gammaMean, setGammaMean] = useState([]);
    const [gammaMedian, setGammaMedian] = useState([]);
    const [gammaMode, setGammaMode] = useState([]);

    const groupBy = (input, key) => {
        return input.reduce((acc, currentValue) => {
            let groupKey = currentValue[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(currentValue);
            return acc;
        }, {});
    };

    const mean = arr => {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total / arr.length;
    };

    const median = arr => {
        const { length } = arr;
        arr.sort((a, b) => a - b);
        if (length % 2 === 0) {
            return (arr[length / 2 - 1] + arr[length / 2]) / 2;
        }
        return arr[(length - 1) / 2];
    };

    const mode = arr => {
        const mode = {};
        let max = 0, count = 0;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (mode[item]) {
                mode[item]++;
            } else {
                mode[item] = 1;
            }
            if (count < mode[item]) {
                max = item;
                count = mode[item];
            }
        }
        return max;
    };

    useEffect(() => {
        // console.log(wineDataSet);
        // console.log("winedataset length", wineDataSet.length);
        const groupedData = groupBy(wineDataSet, "Alcohol");
        // console.log(groupedData, "groupedData");

        let tempFlavanoidsMean = [], tempFlavanoidsMedian = [], tempFlavanoidsMode = [];
        let tempGammaMean = [], tempGammaMedian = [], tempGammaMode = [];
        let tempAlcoholClass = [];
        Object.entries(groupedData).forEach(([key, value]) => {
            // console.log(key, value);
            tempAlcoholClass.push(key);
            let newArray = [];
            let gammaArray = [];
            Object.entries(value).forEach(([key1, value1], index) => {
                newArray.push(Number(value[key1]["Flavanoids"]));
                gammaArray.push((Number(value[key1]["Ash"]) * Number(value[key1]["Hue"])) / Number(value[key1]["Magnesium"]));
            });
            // console.log(key);
            tempFlavanoidsMean[key] = mean(newArray).toFixed(3);
            tempFlavanoidsMedian[key] = median(newArray).toFixed(3);
            tempFlavanoidsMode[key] = mode(newArray).toFixed(3);

            tempGammaMean[key] = mean(gammaArray).toFixed(3);
            tempGammaMedian[key] = median(gammaArray).toFixed(3);
            tempGammaMode[key] = mode(gammaArray).toFixed(3);
        });
        setAlcoholClass(tempAlcoholClass);

        setFlavanoidsMean(tempFlavanoidsMean);
        setFlavanoidsMedian(tempFlavanoidsMedian);
        setFlavanoidsMode(tempFlavanoidsMode);

        setGammaMean(tempGammaMean);
        setGammaMedian(tempGammaMedian);
        setGammaMode(tempGammaMode);

    }, []);

    useEffect(() => {
        // console.log("alcoholClass", alcoholClass);
    }, [alcoholClass]);

    return (
        <div className={styles.container}>
            <h1>Some Statistical Measures of Wine Data Set - Refactored Code</h1>
            <table>
                <thead>
                    <tr>
                        <th>Measure</th>
                        {alcoholClass.map(data => (
                            <th>Class {data}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Flavanoids Mean</td>
                        {alcoholClass.map((data, index) => (
                            <td>{flavanoidsMean[index + 1]}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Flavanoids Median</td>
                        {alcoholClass.map((data, index) => (
                            <td>{flavanoidsMedian[index + 1]}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Flavanoids Mode</td>
                        {alcoholClass.map((data, index) => (
                            <td>{flavanoidsMode[index + 1]}</td>
                        ))}
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Measure</th>
                        {alcoholClass.map(data => (
                            <th>Class {data}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gamma Mean</td>
                        {alcoholClass.map((data, index) => (
                            <td>{gammaMean[index + 1]}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Gamma Median</td>
                        {alcoholClass.map((data, index) => (
                            <td>{gammaMedian[index + 1]}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Gamma Mode</td>
                        {alcoholClass.map((data, index) => (
                            <td>{gammaMode[index + 1]}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div >
    );
}

export default App;
