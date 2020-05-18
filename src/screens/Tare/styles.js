import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  header: {
    flex: 0.08,
    backgroundColor: '#4afbc1',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  notification: {
    fontSize: 20,
    textAlign: 'center',
  },
  body: {
    flex: 0.6,
  },
  app_title: {
    padding: 10,
    textAlign: 'center',
  },
  header_text: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  warning_container: {
    flex: 1,
    backgroundColor: '#4afbc1',
    justifyContent: 'center',
  },
  warning: {
    textAlign: 'center',
    fontSize: 18,
  },
  weight_box: {
    backgroundColor: 'red',
    flex: 0.4,
    alignItems: 'center',
    width: '30%',
  },
  weight: {
    backgroundColor: 'green',
    width: '50%',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: 'blue',
    flex: 0.35,
  },
  ack_container: {
    backgroundColor: 'green',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ack: {
    fontSize: 14,
  },
  button_container: {
    flex: 0.5,
    justifyContent: 'center',
  },
});

export default styles;
