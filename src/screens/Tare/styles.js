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
    flex: 0.7,
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
    flex: 0.3,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'flex-end',
  },
});

export default styles;
